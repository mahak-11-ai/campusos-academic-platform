import express from 'express';
import { getStudentStats, getTeacherStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/student', protect, getStudentStats);
router.get('/teacher', protect, getTeacherStats);

export default router;
