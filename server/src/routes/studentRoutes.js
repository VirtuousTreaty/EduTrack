import express from 'express';
import { 
  getStudentProfile, 
  updateStudentProfile, 
  addAcademicRecord, 
  addActivity 
} from '../controllers/studentController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, getStudentProfile);
router.get('/profile/:id', authenticateToken, getStudentProfile);
router.put('/profile', authenticateToken, requireRole(['student']), updateStudentProfile);
router.post('/academic-records', authenticateToken, requireRole(['student', 'university']), addAcademicRecord);
router.post('/activities', authenticateToken, requireRole(['student']), addActivity);

export default router;
