import { getDb } from '../config/db.js';
import { canAccessStudent } from '../utils/accessControl.js';
import { hydrateStudent } from '../utils/formatters.js';
import {
  activityTypes,
  normalizeStringArray,
  parseInteger,
  requireEnum,
  requireString,
  sendValidationError,
  validateAcademicYear,
  validateGpa
} from '../utils/validation.js';

async function getTargetStudentForWrite(db, user, studentId) {
  if (user.role === 'student') {
    return db.get('SELECT * FROM students WHERE user_id = ?', [user.userId]);
  }

  if (user.role === 'university') {
    if (!studentId) return null;
    const student = await db.get('SELECT * FROM students WHERE id = ?', [studentId]);
    if (!student || !(await canAccessStudent(db, user, student))) {
      return null;
    }
    return student;
  }

  return null;
}

export async function getStudentProfile(req, res) {
  try {
    const db = await getDb();
    let student = null;

    if (req.params.id) {
      student = await db.get('SELECT * FROM students WHERE id = ? OR user_id = ?', [req.params.id, req.params.id]);
    } else if (req.user.role === 'student') {
      student = await db.get('SELECT * FROM students WHERE user_id = ?', [req.user.userId]);
    } else {
      return res.status(400).json({ success: false, error: 'Student id is required for this role' });
    }

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    if (!(await canAccessStudent(db, req.user, student))) {
      return res.status(403).json({ success: false, error: 'Forbidden: You cannot access this student profile' });
    }

    const formattedStudent = await hydrateStudent(db, student);
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
    const errors = [];

    const updatedName = name !== undefined ? String(name).trim() : student.name;
    const updatedUniv = university !== undefined ? String(university).trim() : student.university;
    const updatedCourse = course !== undefined ? String(course).trim() : student.course;
    const updatedAvatar = avatar !== undefined ? String(avatar).trim() : student.avatar;
    const updatedYear = year !== undefined ? validateAcademicYear(year, 'Academic year', errors) : student.year;
    const updatedGpa = gpa !== undefined ? validateGpa(gpa, 'GPA', errors) : student.gpa;
    const updatedSkills = skills !== undefined ? JSON.stringify(normalizeStringArray(skills)) : student.skills;

    requireString(updatedName, 'Name', errors);
    requireString(updatedUniv, 'University', errors);
    requireString(updatedCourse, 'Course', errors);

    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

    await db.run(
      `UPDATE students
       SET name = ?, university = ?, course = ?, year = ?, gpa = ?, skills = ?, avatar = ?
       WHERE id = ?`,
      [updatedName, updatedUniv, updatedCourse, updatedYear, updatedGpa, updatedSkills, updatedAvatar, student.id]
    );

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
    const student = await getTargetStudentForWrite(db, req.user, req.body.studentId);

    if (!student) {
      const status = req.user.role === 'university' ? 403 : 404;
      return res.status(status).json({ success: false, error: 'Student profile not found or not accessible' });
    }

    const { semester, year, gpa, subjects } = req.body;
    const errors = [];
    requireString(semester, 'Semester', errors);

    const recordYear = parseInteger(year);
    if (recordYear === null || recordYear < 2000 || recordYear > 2100) {
      errors.push('Year must be a valid calendar year');
    }

    const parsedGpa = validateGpa(gpa, 'GPA', errors);
    const normalizedSubjects = Array.isArray(subjects) ? subjects : [];

    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

    const recordId = 'ar-' + Date.now();
    const subjectsJson = JSON.stringify(normalizedSubjects);

    await db.run(
      `INSERT INTO academic_records (id, student_id, semester, year, gpa, subjects)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [recordId, student.id, semester.trim(), recordYear, parsedGpa, subjectsJson]
    );

    const allRecords = await db.all('SELECT gpa FROM academic_records WHERE student_id = ?', [student.id]);
    if (allRecords.length > 0) {
      const avgGpa = (allRecords.reduce((acc, record) => acc + record.gpa, 0) / allRecords.length).toFixed(2);
      await db.run('UPDATE students SET gpa = ? WHERE id = ?', [parseFloat(avgGpa), student.id]);
    }

    return res.status(201).json({
      success: true,
      message: 'Academic record added successfully',
      record: { id: recordId, semester: semester.trim(), year: recordYear, gpa: parsedGpa, subjects: normalizedSubjects }
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
    const errors = [];
    requireEnum(type, activityTypes, 'Activity type', errors);
    requireString(title, 'Title', errors);
    requireString(description, 'Description', errors);
    requireString(date, 'Date', errors);

    const parsedHours = parseInteger(hours);
    if (parsedHours === null || parsedHours < 1 || parsedHours > 10000) {
      errors.push('Hours must be an integer between 1 and 10000');
    }

    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

    const activityId = 'act-' + Date.now();
    const normalizedSkills = normalizeStringArray(skills);

    await db.run(
      `INSERT INTO activities (id, student_id, type, title, description, date, hours, skills)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [activityId, student.id, type, title.trim(), description.trim(), date, parsedHours, JSON.stringify(normalizedSkills)]
    );

    return res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      activity: { id: activityId, type, title: title.trim(), description: description.trim(), date, hours: parsedHours, skills: normalizedSkills }
    });
  } catch (error) {
    console.error('addActivity error:', error);
    return res.status(500).json({ success: false, error: 'Failed to add activity' });
  }
}
