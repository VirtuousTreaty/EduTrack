import express from 'express';
import { searchCandidates, getRecommendations, getCompanyAnalytics } from '../controllers/companyController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/students', authenticateToken, requireRole(['company', 'university']), searchCandidates);
router.post('/recommendations', authenticateToken, requireRole(['company']), getRecommendations);
router.get('/analytics', authenticateToken, requireRole(['company']), getCompanyAnalytics);

export default router;
