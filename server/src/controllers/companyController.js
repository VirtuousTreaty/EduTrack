import { getDb } from '../config/db.js';
import { formatStudent, parseJsonArray } from '../utils/formatters.js';
import { normalizeStringArray, parseNumber, sendValidationError } from '../utils/validation.js';

async function hydrateCompanyStudent(db, student) {
  const academicRecords = await db.all('SELECT * FROM academic_records WHERE student_id = ?', [student.id]);
  const certificates = await db.all(
    "SELECT * FROM certificates WHERE student_id = ? AND status = 'approved'",
    [student.id]
  );
  const activities = await db.all('SELECT * FROM activities WHERE student_id = ?', [student.id]);

  return formatStudent(student, academicRecords, certificates, activities);
}

function parseGpaFilter(value, fieldName, errors) {
  if (value === undefined || value === '') return null;
  const parsed = parseNumber(value);
  if (parsed === null || parsed < 0 || parsed > 4) {
    errors.push(`${fieldName} must be a number between 0 and 4`);
  }
  return parsed;
}

export async function searchCandidates(req, res) {
  try {
    const db = await getDb();
    const { skills, minGpa, maxGpa, course, year, search } = req.query;
    const errors = [];

    const minGpaValue = parseGpaFilter(minGpa, 'Minimum GPA', errors);
    const maxGpaValue = parseGpaFilter(maxGpa, 'Maximum GPA', errors);
    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

    let query = 'SELECT * FROM students';
    const params = [];
    const conditions = [];

    if (minGpaValue !== null) {
      conditions.push('gpa >= ?');
      params.push(minGpaValue);
    }
    if (maxGpaValue !== null) {
      conditions.push('gpa <= ?');
      params.push(maxGpaValue);
    }
    if (course && course !== 'all') {
      conditions.push('course = ?');
      params.push(course);
    }
    if (year && year !== 'all') {
      conditions.push('year = ?');
      params.push(parseInt(year, 10));
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

    if (skills) {
      const requiredSkills = normalizeStringArray(skills).map(skill => skill.toLowerCase());
      students = students.filter(student => {
        const studentSkills = parseJsonArray(student.skills).map(skill => skill.toLowerCase());
        return requiredSkills.some(requiredSkill => studentSkills.includes(requiredSkill));
      });
    }

    const result = await Promise.all(students.map(student => hydrateCompanyStudent(db, student)));

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
    const skillList = normalizeStringArray(requiredSkills).map(skill => skill.toLowerCase());
    const errors = [];
    const minGpaVal = parseGpaFilter(minGpa, 'Minimum GPA', errors);

    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

    const scoredStudents = await Promise.all(
      students.map(async student => {
        const studentSkills = parseJsonArray(student.skills).map(skill => skill.toLowerCase());
        const academicRecords = await db.all('SELECT * FROM academic_records WHERE student_id = ?', [student.id]);
        const certificates = await db.all(
          "SELECT * FROM certificates WHERE student_id = ? AND status = 'approved'",
          [student.id]
        );
        const activities = await db.all('SELECT * FROM activities WHERE student_id = ?', [student.id]);

        let score = 0;
        const reasons = [];

        if (skillList.length > 0) {
          const matchedSkills = skillList.filter(skill => studentSkills.includes(skill));
          const skillRatio = matchedSkills.length / skillList.length;
          const skillPoints = Math.round(skillRatio * 50);
          score += skillPoints;
          if (matchedSkills.length > 0) {
            reasons.push(`Matched ${matchedSkills.length} requested skills (${matchedSkills.join(', ')})`);
          }
        } else {
          score += 30;
        }

        if (student.gpa >= (minGpaVal || 0)) {
          const gpaPoints = Math.min(30, Math.round((student.gpa / 4.0) * 30));
          score += gpaPoints;
          reasons.push(`GPA ${student.gpa} meets requested minimum ${(minGpaVal || 0)}`);
        } else {
          reasons.push(`GPA ${student.gpa} below target ${(minGpaVal || 0)}`);
        }

        const certBonus = Math.min(10, certificates.length * 5);
        const activityBonus = Math.min(10, activities.length * 5);
        score += certBonus + activityBonus;

        if (certificates.length > 0) {
          reasons.push(`${certificates.length} verified university certificate(s)`);
        }

        if (preferredCourse && student.course.toLowerCase().includes(preferredCourse.toLowerCase())) {
          score = Math.min(100, score + 10);
          reasons.push(`Enrolled in preferred degree: ${student.course}`);
        }

        const matchPercentage = Math.min(100, Math.max(10, score));

        return {
          matchPercentage,
          matchScore: matchPercentage,
          reasons,
          student: formatStudent(student, academicRecords, certificates, activities)
        };
      })
    );

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

    const skillCounts = {};
    students.forEach(student => {
      parseJsonArray(student.skills).forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
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
        averageGpa: parseFloat((students.reduce((acc, student) => acc + student.gpa, 0) / (students.length || 1)).toFixed(2)),
        topSkills,
        yearBreakdown: [
          { year: 'Year 1', count: students.filter(student => student.year === 1).length },
          { year: 'Year 2', count: students.filter(student => student.year === 2).length },
          { year: 'Year 3', count: students.filter(student => student.year === 3).length },
          { year: 'Year 4', count: students.filter(student => student.year === 4).length }
        ]
      }
    });
  } catch (error) {
    console.error('getCompanyAnalytics error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch company analytics' });
  }
}
