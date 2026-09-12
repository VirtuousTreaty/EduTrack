import { getDb } from '../config/db.js';

export async function getStudentProfile(req, res) {
  try {
    const db = await getDb();
    let student = null;

    if (req.params.id) {
      student = await db.get('SELECT * FROM students WHERE id = ? OR user_id = ?', [req.params.id, req.params.id]);
    } else {
      student = await db.get('SELECT * FROM students WHERE user_id = ?', [req.user.userId]);
    }

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const academicRecords = await db.all('SELECT * FROM academic_records WHERE student_id = ?', [student.id]);
    const certificates = await db.all('SELECT * FROM certificates WHERE student_id = ?', [student.id]);
    const activities = await db.all('SELECT * FROM activities WHERE student_id = ?', [student.id]);

    const formattedStudent = {
      id: student.id,
      userId: student.user_id,
      name: student.name,
      email: student.email,
      university: student.university,
      course: student.course,
      year: student.year,
      gpa: student.gpa,
      skills: JSON.parse(student.skills || '[]'),
      avatar: student.avatar,
      academicRecords: academicRecords.map(r => ({
        id: r.id,
        semester: r.semester,
        year: r.year,
        gpa: r.gpa,
        subjects: JSON.parse(r.subjects || '[]')
      })),
      certificates: certificates.map(c => ({
        id: c.id,
        studentId: c.student_id,
        title: c.title,
        issuer: c.issuer,
        dateIssued: c.date_issued,
        status: c.status,
        type: c.type,
        fileUrl: c.file_url
      })),
      activities: activities.map(a => ({
        id: a.id,
        type: a.type,
        title: a.title,
        description: a.description,
        date: a.date,
        hours: a.hours,
        skills: JSON.parse(a.skills || '[]')
      }))
    };

    return res.json({ success: true, student: formattedStudent });
  } catch (error) {
    console.error('getStudentProfile error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch student profile' });
  }
}

export async function updateStudentProfile(req, res) {
  try {
    const db = await getDb();
    const student = await db.get('SELECT * FROM students WHERE user_id = ?', [req.user.userId]);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const { name, university, course, year, gpa, skills, avatar } = req.body;

    const updatedName = name || student.name;
    const updatedUniv = university || student.university;
    const updatedCourse = course || student.course;
    const updatedYear = year !== undefined ? parseInt(year) : student.year;
    const updatedGpa = gpa !== undefined ? parseFloat(gpa) : student.gpa;
    const updatedSkills = skills ? JSON.stringify(skills) : student.skills;
    const updatedAvatar = avatar || student.avatar;

    await db.run(
      `UPDATE students 
       SET name = ?, university = ?, course = ?, year = ?, gpa = ?, skills = ?, avatar = ?
       WHERE id = ?`,
      [updatedName, updatedUniv, updatedCourse, updatedYear, updatedGpa, updatedSkills, updatedAvatar, student.id]
    );

    // Also update users table name/avatar
    await db.run('UPDATE users SET name = ?, avatar = ? WHERE id = ?', [updatedName, updatedAvatar, req.user.userId]);

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('updateStudentProfile error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update student profile' });
  }
}

export async function addAcademicRecord(req, res) {
  try {
    const db = await getDb();
    const student = await db.get('SELECT * FROM students WHERE user_id = ?', [req.user.userId]);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const { semester, year, gpa, subjects } = req.body;
    if (!semester || !year || gpa === undefined) {
      return res.status(400).json({ success: false, error: 'Semester, year, and GPA are required' });
    }

    const recordId = 'ar-' + Date.now();
    const subjectsJson = JSON.stringify(subjects || []);

    await db.run(
      `INSERT INTO academic_records (id, student_id, semester, year, gpa, subjects)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [recordId, student.id, semester, parseInt(year), parseFloat(gpa), subjectsJson]
    );

    // Recalculate average overall GPA for student
    const allRecords = await db.all('SELECT gpa FROM academic_records WHERE student_id = ?', [student.id]);
    if (allRecords.length > 0) {
      const avgGpa = (allRecords.reduce((acc, r) => acc + r.gpa, 0) / allRecords.length).toFixed(2);
      await db.run('UPDATE students SET gpa = ? WHERE id = ?', [parseFloat(avgGpa), student.id]);
    }

    return res.status(201).json({
      success: true,
      message: 'Academic record added successfully',
      record: { id: recordId, semester, year, gpa: parseFloat(gpa), subjects: subjects || [] }
    });
  } catch (error) {
    console.error('addAcademicRecord error:', error);
    return res.status(500).json({ success: false, error: 'Failed to add academic record' });
  }
}

export async function addActivity(req, res) {
  try {
    const db = await getDb();
    const student = await db.get('SELECT * FROM students WHERE user_id = ?', [req.user.userId]);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const { type, title, description, date, hours, skills } = req.body;
    if (!type || !title || !description || !date || hours === undefined) {
      return res.status(400).json({ success: false, error: 'All activity fields are required' });
    }

    const activityId = 'act-' + Date.now();
    const skillsJson = JSON.stringify(skills || []);

    await db.run(
      `INSERT INTO activities (id, student_id, type, title, description, date, hours, skills)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [activityId, student.id, type, title, description, date, parseInt(hours), skillsJson]
    );

    return res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      activity: { id: activityId, type, title, description, date, hours: parseInt(hours), skills: skills || [] }
    });
  } catch (error) {
    console.error('addActivity error:', error);
    return res.status(500).json({ success: false, error: 'Failed to add activity' });
  }
}
