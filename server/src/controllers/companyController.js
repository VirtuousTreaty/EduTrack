import { getDb } from '../config/db.js';

export async function searchCandidates(req, res) {
  try {
    const db = await getDb();
    const { skills, minGpa, maxGpa, course, year, search } = req.query;

    let query = 'SELECT * FROM students';
    const params = [];
    const conditions = [];

    if (minGpa) {
      conditions.push('gpa >= ?');
      params.push(parseFloat(minGpa));
    }
    if (maxGpa) {
      conditions.push('gpa <= ?');
      params.push(parseFloat(maxGpa));
    }
    if (course && course !== 'all') {
      conditions.push('course = ?');
      params.push(course);
    }
    if (year && year !== 'all') {
      conditions.push('year = ?');
      params.push(parseInt(year));
    }
    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR university LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    let students = await db.all(query, params);

    // Filter by skills if specified
    if (skills) {
      const requiredSkills = (Array.isArray(skills) ? skills : skills.split(',')).map(s => s.trim().toLowerCase());
      students = students.filter(student => {
        const studentSkills = (JSON.parse(student.skills || '[]')).map(s => s.toLowerCase());
        return requiredSkills.some(reqSkill => studentSkills.includes(reqSkill));
      });
    }

    // Hydrate student records
    const result = await Promise.all(
      students.map(async s => {
        const academicRecords = await db.all('SELECT * FROM academic_records WHERE student_id = ?', [s.id]);
        const certificates = await db.all('SELECT * FROM certificates WHERE student_id = ?', [s.id]);
        const activities = await db.all('SELECT * FROM activities WHERE student_id = ?', [s.id]);

        return {
          id: s.id,
          userId: s.user_id,
          name: s.name,
          email: s.email,
          university: s.university,
          course: s.course,
          year: s.year,
          gpa: s.gpa,
          skills: JSON.parse(s.skills || '[]'),
          avatar: s.avatar,
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
      })
    );

    return res.json({ success: true, students: result });
  } catch (error) {
    console.error('searchCandidates error:', error);
    return res.status(500).json({ success: false, error: 'Failed to search candidate talent pool' });
  }
}

export async function getRecommendations(req, res) {
  try {
    const { requiredSkills, minGpa, preferredCourse } = req.body;
    const db = await getDb();

    const students = await db.all('SELECT * FROM students');
    const skillList = Array.isArray(requiredSkills) 
      ? requiredSkills.map(s => s.toLowerCase())
      : (requiredSkills ? requiredSkills.split(',').map(s => s.trim().toLowerCase()) : []);

    const minGpaVal = minGpa ? parseFloat(minGpa) : 0;

    const scoredStudents = await Promise.all(
      students.map(async s => {
        const studentSkills = (JSON.parse(s.skills || '[]')).map(sk => sk.toLowerCase());
        const academicRecords = await db.all('SELECT * FROM academic_records WHERE student_id = ?', [s.id]);
        const certificates = await db.all('SELECT * FROM certificates WHERE student_id = ?', [s.id]);
        const activities = await db.all('SELECT * FROM activities WHERE student_id = ?', [s.id]);

        let score = 0;
        let reasons = [];

        // 1. Skill match score (up to 50 points)
        if (skillList.length > 0) {
          const matchedSkills = skillList.filter(sk => studentSkills.includes(sk));
          const skillRatio = matchedSkills.length / skillList.length;
          const skillPoints = Math.round(skillRatio * 50);
          score += skillPoints;
          if (matchedSkills.length > 0) {
            reasons.push(`Matched ${matchedSkills.length} requested skills (${matchedSkills.join(', ')})`);
          }
        } else {
          score += 30; // base score if no specific skills requested
        }

        // 2. GPA score (up to 30 points)
        if (s.gpa >= minGpaVal) {
          const gpaPoints = Math.min(30, Math.round((s.gpa / 4.0) * 30));
          score += gpaPoints;
          reasons.push(`Excellent GPA of ${s.gpa} (min requested ${minGpaVal})`);
        } else {
          reasons.push(`GPA ${s.gpa} below target ${minGpaVal}`);
        }

        // 3. Certificate & Activity bonus (up to 20 points)
        const approvedCerts = certificates.filter(c => c.status === 'approved').length;
        const certBonus = Math.min(10, approvedCerts * 5);
        const activityBonus = Math.min(10, activities.length * 5);
        score += certBonus + activityBonus;

        if (approvedCerts > 0) {
          reasons.push(`${approvedCerts} verified university certificate(s)`);
        }

        // Preferred course bonus
        if (preferredCourse && s.course.toLowerCase().includes(preferredCourse.toLowerCase())) {
          score = Math.min(100, score + 10);
          reasons.push(`Enrolled in preferred degree: ${s.course}`);
        }

        const matchPercentage = Math.min(100, Math.max(10, score));

        return {
          matchPercentage,
          matchScore: matchPercentage,
          reasons,
          student: {
            id: s.id,
            userId: s.user_id,
            name: s.name,
            email: s.email,
            university: s.university,
            course: s.course,
            year: s.year,
            gpa: s.gpa,
            skills: JSON.parse(s.skills || '[]'),
            avatar: s.avatar,
            academicRecords: academicRecords.map(r => ({
              id: r.id,
              semester: r.semester,
              year: r.year,
              gpa: r.gpa,
              subjects: JSON.parse(r.subjects || '[]')
            })),
            certificates: certificates.map(c => ({
              id: c.id,
              title: c.title,
              issuer: c.issuer,
              status: c.status,
              type: c.type
            })),
            activities: activities.map(a => ({
              id: a.id,
              title: a.title,
              type: a.type
            }))
          }
        };
      })
    );

    // Sort by match percentage descending
    scoredStudents.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.json({ success: true, recommendations: scoredStudents });
  } catch (error) {
    console.error('getRecommendations error:', error);
    return res.status(500).json({ success: false, error: 'Failed to compute candidate recommendations' });
  }
}

export async function getCompanyAnalytics(req, res) {
  try {
    const db = await getDb();
    const students = await db.all('SELECT * FROM students');
    
    // Aggregate skill frequencies
    const skillCounts = {};
    students.forEach(s => {
      const skills = JSON.parse(s.skills || '[]');
      skills.forEach(sk => {
        skillCounts[sk] = (skillCounts[sk] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.json({
      success: true,
      analytics: {
        totalTalentPool: students.length,
        averageGpa: parseFloat((students.reduce((acc, s) => acc + s.gpa, 0) / (students.length || 1)).toFixed(2)),
        topSkills,
        yearBreakdown: [
          { year: 'Year 1', count: students.filter(s => s.year === 1).length },
          { year: 'Year 2', count: students.filter(s => s.year === 2).length },
          { year: 'Year 3', count: students.filter(s => s.year === 3).length },
          { year: 'Year 4', count: students.filter(s => s.year === 4).length }
        ]
      }
    });
  } catch (error) {
    console.error('getCompanyAnalytics error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch company analytics' });
  }
}
