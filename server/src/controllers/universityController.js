import { getDb } from '../config/db.js';

export async function getStudentsList(req, res) {
  try {
    const db = await getDb();
    const { course, year, search } = req.query;

    let query = 'SELECT * FROM students';
    const params = [];
    const conditions = [];

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

    query += ' ORDER BY name ASC';

    const students = await db.all(query, params);

    // Fetch related records for each student
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
    console.error('getStudentsList error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
}

export async function getUniversityAnalytics(req, res) {
  try {
    const db = await getDb();

    const totalStudentsObj = await db.get('SELECT COUNT(*) as count FROM students');
    const totalCertsObj = await db.get('SELECT COUNT(*) as count FROM certificates');
    const pendingCertsObj = await db.get("SELECT COUNT(*) as count FROM certificates WHERE status = 'pending'");
    const approvedCertsObj = await db.get("SELECT COUNT(*) as count FROM certificates WHERE status = 'approved'");
    const rejectedCertsObj = await db.get("SELECT COUNT(*) as count FROM certificates WHERE status = 'rejected'");
    const avgGpaObj = await db.get('SELECT AVG(gpa) as avgGpa FROM students');

    const courseDistribution = await db.all(
      'SELECT course, COUNT(*) as count, AVG(gpa) as avgGpa FROM students GROUP BY course'
    );

    const yearDistribution = await db.all(
      'SELECT year, COUNT(*) as count FROM students GROUP BY year ORDER BY year ASC'
    );

    const certificateTypeStats = await db.all(
      'SELECT type, status, COUNT(*) as count FROM certificates GROUP BY type, status'
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
    
    const students = await db.all('SELECT * FROM students ORDER BY gpa DESC');
    const certs = await db.all('SELECT status, count(*) as total FROM certificates GROUP BY status');

    return res.json({
      success: true,
      report: {
        generatedAt: new Date().toISOString(),
        totalStudents: students.length,
        topPerformers: students.slice(0, 5).map(s => ({
          id: s.id,
          name: s.name,
          course: s.course,
          year: s.year,
          gpa: s.gpa
        })),
        certificateBreakdown: certs
      }
    });
  } catch (error) {
    console.error('getUniversityReports error:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate reports' });
  }
}
