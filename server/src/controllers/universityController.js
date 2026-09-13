import { getDb } from '../config/db.js';
import { getScopedUniversityName } from '../utils/accessControl.js';
import { hydrateStudent } from '../utils/formatters.js';

async function requireUniversityScope(db, req, res) {
  const universityName = await getScopedUniversityName(db, req.user);
  if (!universityName) {
    res.status(403).json({ success: false, error: 'University profile not found for this account' });
    return null;
  }
  return universityName;
}

export async function getStudentsList(req, res) {
  try {
    const db = await getDb();
    const universityName = await requireUniversityScope(db, req, res);
    if (!universityName) return;

    const { course, year, search } = req.query;

    let query = 'SELECT * FROM students';
    const params = [];
    const conditions = ['university = ?'];
    params.push(universityName);

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

    query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY name ASC';

    const students = await db.all(query, params);
    const result = await Promise.all(students.map(student => hydrateStudent(db, student)));

    return res.json({ success: true, students: result });
  } catch (error) {
    console.error('getStudentsList error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
}

export async function getUniversityAnalytics(req, res) {
  try {
    const db = await getDb();
    const universityName = await requireUniversityScope(db, req, res);
    if (!universityName) return;

    const totalStudentsObj = await db.get('SELECT COUNT(*) as count FROM students WHERE university = ?', [universityName]);
    const totalCertsObj = await db.get(
      `SELECT COUNT(*) as count
       FROM certificates c
       JOIN students s ON c.student_id = s.id
       WHERE s.university = ?`,
      [universityName]
    );
    const pendingCertsObj = await db.get(
      `SELECT COUNT(*) as count
       FROM certificates c
       JOIN students s ON c.student_id = s.id
       WHERE s.university = ? AND c.status = 'pending'`,
      [universityName]
    );
    const approvedCertsObj = await db.get(
      `SELECT COUNT(*) as count
       FROM certificates c
       JOIN students s ON c.student_id = s.id
       WHERE s.university = ? AND c.status = 'approved'`,
      [universityName]
    );
    const rejectedCertsObj = await db.get(
      `SELECT COUNT(*) as count
       FROM certificates c
       JOIN students s ON c.student_id = s.id
       WHERE s.university = ? AND c.status = 'rejected'`,
      [universityName]
    );
    const avgGpaObj = await db.get('SELECT AVG(gpa) as avgGpa FROM students WHERE university = ?', [universityName]);

    const courseDistribution = await db.all(
      'SELECT course, COUNT(*) as count, AVG(gpa) as avgGpa FROM students WHERE university = ? GROUP BY course',
      [universityName]
    );

    const yearDistribution = await db.all(
      'SELECT year, COUNT(*) as count FROM students WHERE university = ? GROUP BY year ORDER BY year ASC',
      [universityName]
    );

    const certificateTypeStats = await db.all(
      `SELECT c.type, c.status, COUNT(*) as count
       FROM certificates c
       JOIN students s ON c.student_id = s.id
       WHERE s.university = ?
       GROUP BY c.type, c.status`,
      [universityName]
    );

    return res.json({
      success: true,
      analytics: {
        totalStudents: totalStudentsObj.count || 0,
        totalCertificates: totalCertsObj.count || 0,
        pendingCertificates: pendingCertsObj.count || 0,
        approvedCertificates: approvedCertsObj.count || 0,
        rejectedCertificates: rejectedCertsObj.count || 0,
        averageGpa: parseFloat((avgGpaObj.avgGpa || 0).toFixed(2)),
        courseDistribution,
        yearDistribution,
        certificateTypeStats
      }
    });
  } catch (error) {
    console.error('getUniversityAnalytics error:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate university analytics' });
  }
}

export async function getUniversityReports(req, res) {
  try {
    const db = await getDb();
    const universityName = await requireUniversityScope(db, req, res);
    if (!universityName) return;

    const students = await db.all('SELECT * FROM students WHERE university = ? ORDER BY gpa DESC', [universityName]);
    const certs = await db.all(
      `SELECT c.status, COUNT(*) as total
       FROM certificates c
       JOIN students s ON c.student_id = s.id
       WHERE s.university = ?
       GROUP BY c.status`,
      [universityName]
    );

    return res.json({
      success: true,
      report: {
        generatedAt: new Date().toISOString(),
        university: universityName,
        totalStudents: students.length,
        topPerformers: students.slice(0, 5).map(student => ({
          id: student.id,
          name: student.name,
          course: student.course,
          year: student.year,
          gpa: student.gpa
        })),
        certificateBreakdown: certs
      }
    });
  } catch (error) {
    console.error('getUniversityReports error:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate reports' });
  }
}
