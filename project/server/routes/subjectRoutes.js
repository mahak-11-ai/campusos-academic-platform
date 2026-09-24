import express from 'express';
import {
  getSubjects,
  getSubject,
  createSubject,
} from '../controllers/subjectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSubjects);
router.get('/:id', getSubject);
router.post('/', protect, authorize('teacher'), createSubject);

export default router;
