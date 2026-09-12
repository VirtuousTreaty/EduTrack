import express from 'express';
import { 
  uploadCertificateFile, 
  getMyCertificates, 
  getAllCertificates, 
  updateCertificateStatus 
} from '../controllers/certificateController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import { uploadCertificate } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', authenticateToken, requireRole(['student']), uploadCertificate.single('file'), uploadCertificateFile);
router.get('/my-certificates', authenticateToken, requireRole(['student']), getMyCertificates);
router.get('/all', authenticateToken, requireRole(['university', 'company']), getAllCertificates);
router.patch('/:id/status', authenticateToken, requireRole(['university']), updateCertificateStatus);

export default router;
