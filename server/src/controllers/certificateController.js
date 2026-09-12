import { getDb } from '../config/db.js';

export async function uploadCertificateFile(req, res) {
  try {
    const db = await getDb();
    const student = await db.get('SELECT * FROM students WHERE user_id = ?', [req.user.userId]);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const { title, issuer, dateIssued, type } = req.body;

    if (!title || !issuer || !dateIssued || !type) {
      return res.status(400).json({ success: false, error: 'Title, issuer, date issued, and type are required' });
    }

    let fileUrl = '';
    if (req.file) {
      fileUrl = `/uploads/certificates/${req.file.filename}`;
    }

    const certId = 'c-' + Date.now();

    await db.run(
      `INSERT INTO certificates (id, student_id, title, issuer, date_issued, status, type, file_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [certId, student.id, title, issuer, dateIssued, 'pending', type, fileUrl]
    );

    return res.status(201).json({
      success: true,
      message: 'Certificate submitted successfully for review',
      certificate: {
        id: certId,
        studentId: student.id,
        title,
        issuer,
        dateIssued,
        status: 'pending',
        type,
        fileUrl
      }
    });
  } catch (error) {
    console.error('uploadCertificateFile error:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit certificate' });
  }
}

export async function getMyCertificates(req, res) {
  try {
    const db = await getDb();
    const student = await db.get('SELECT * FROM students WHERE user_id = ?', [req.user.userId]);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const certificates = await db.all('SELECT * FROM certificates WHERE student_id = ? ORDER BY created_at DESC', [student.id]);

    return res.json({
      success: true,
      certificates: certificates.map(c => ({
        id: c.id,
        studentId: c.student_id,
        title: c.title,
        issuer: c.issuer,
        dateIssued: c.date_issued,
        status: c.status,
        type: c.type,
        fileUrl: c.file_url,
        createdAt: c.created_at
      }))
    });
  } catch (error) {
    console.error('getMyCertificates error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch certificates' });
  }
}

export async function getAllCertificates(req, res) {
  try {
    const db = await getDb();
    const { status, type } = req.query;

    let query = `
      SELECT c.*, s.name as student_name, s.email as student_email, s.university, s.avatar as student_avatar
      FROM certificates c
      JOIN students s ON c.student_id = s.id
    `;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('c.status = ?');
      params.push(status);
    }
    if (type) {
      conditions.push('c.type = ?');
      params.push(type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.created_at DESC';

    const certificates = await db.all(query, params);

    return res.json({
      success: true,
      certificates: certificates.map(c => ({
        id: c.id,
        studentId: c.student_id,
        studentName: c.student_name,
        studentEmail: c.student_email,
        studentAvatar: c.student_avatar,
        university: c.university,
        title: c.title,
        issuer: c.issuer,
        dateIssued: c.date_issued,
        status: c.status,
        type: c.type,
        fileUrl: c.file_url,
        createdAt: c.created_at
      }))
    });
  } catch (error) {
    console.error('getAllCertificates error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch certificates' });
  }
}

export async function updateCertificateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const db = await getDb();
    const certificate = await db.get('SELECT * FROM certificates WHERE id = ?', [id]);

    if (!certificate) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    await db.run('UPDATE certificates SET status = ? WHERE id = ?', [status, id]);

    return res.json({
      success: true,
      message: `Certificate status updated to ${status}`
    });
  } catch (error) {
    console.error('updateCertificateStatus error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update certificate status' });
  }
}
