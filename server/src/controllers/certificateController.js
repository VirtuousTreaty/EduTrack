import fs from 'fs/promises';
import { getDb } from '../config/db.js';
import { getScopedUniversityName } from '../utils/accessControl.js';
import {
  certificateStatuses,
  certificateTypes,
  requireEnum,
  requireString,
  sendValidationError
} from '../utils/validation.js';

async function removeUploadedFile(file) {
  if (!file?.path) return;
  try {
    await fs.unlink(file.path);
  } catch {
    // The request can still fail cleanly if the temporary upload was already gone.
  }
}

function formatCertificate(certificate) {
  return {
    id: certificate.id,
    studentId: certificate.student_id,
    studentName: certificate.student_name,
    studentEmail: certificate.student_email,
    studentAvatar: certificate.student_avatar,
    university: certificate.university,
    title: certificate.title,
    issuer: certificate.issuer,
    dateIssued: certificate.date_issued,
    status: certificate.status,
    type: certificate.type,
    fileUrl: certificate.file_url,
    createdAt: certificate.created_at
  };
}

export async function uploadCertificateFile(req, res) {
  try {
    const db = await getDb();
    const student = await db.get('SELECT * FROM students WHERE user_id = ?', [req.user.userId]);

    if (!student) {
      await removeUploadedFile(req.file);
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const { title, issuer, dateIssued, type } = req.body;
    const errors = [];
    requireString(title, 'Title', errors);
    requireString(issuer, 'Issuer', errors);
    requireString(dateIssued, 'Date issued', errors);
    requireEnum(type, certificateTypes, 'Certificate type', errors);

    if (dateIssued && Number.isNaN(Date.parse(dateIssued))) {
      errors.push('Date issued must be a valid date');
    }

    if (errors.length > 0) {
      await removeUploadedFile(req.file);
      return sendValidationError(res, errors);
    }

    const fileUrl = req.file ? `/uploads/certificates/${req.file.filename}` : '';
    const certId = 'c-' + Date.now();

    await db.run(
      `INSERT INTO certificates (id, student_id, title, issuer, date_issued, status, type, file_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [certId, student.id, title.trim(), issuer.trim(), dateIssued, 'pending', type, fileUrl]
    );

    return res.status(201).json({
      success: true,
      message: 'Certificate submitted successfully for review',
      certificate: {
        id: certId,
        studentId: student.id,
        title: title.trim(),
        issuer: issuer.trim(),
        dateIssued,
        status: 'pending',
        type,
        fileUrl
      }
    });
  } catch (error) {
    await removeUploadedFile(req.file);
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
      certificates: certificates.map(certificate => ({
        id: certificate.id,
        studentId: certificate.student_id,
        title: certificate.title,
        issuer: certificate.issuer,
        dateIssued: certificate.date_issued,
        status: certificate.status,
        type: certificate.type,
        fileUrl: certificate.file_url,
        createdAt: certificate.created_at
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
    const errors = [];

    if (status) {
      requireEnum(status, certificateStatuses, 'Status', errors);
    }
    if (type) {
      requireEnum(type, certificateTypes, 'Certificate type', errors);
    }
    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

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

    if (req.user.role === 'company') {
      conditions.push("c.status = 'approved'");
    }

    const universityName = await getScopedUniversityName(db, req.user);
    if (universityName) {
      conditions.push('s.university = ?');
      params.push(universityName);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.created_at DESC';

    const certificates = await db.all(query, params);

    return res.json({
      success: true,
      certificates: certificates.map(formatCertificate)
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
    const errors = [];
    requireEnum(status, certificateStatuses, 'Status', errors);

    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

    const db = await getDb();
    const certificate = await db.get(
      `SELECT c.*, s.university
       FROM certificates c
       JOIN students s ON c.student_id = s.id
       WHERE c.id = ?`,
      [id]
    );

    if (!certificate) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    const universityName = await getScopedUniversityName(db, req.user);
    if (!universityName || certificate.university !== universityName) {
      return res.status(403).json({ success: false, error: 'Forbidden: You cannot update this certificate' });
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
