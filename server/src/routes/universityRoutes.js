import express from 'express';
import { getStudentsList, getUniversityAnalytics, getUniversityReports } from '../controllers/universityController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/students', authenticateToken, requireRole(['university', 'company']), getStudentsList);
router.get('/analytics', authenticateToken, requireRole(['university']), getUniversityAnalytics);
router.get('/reports', authenticateToken, requireRole(['university']), getUniversityReports);

export default router;
