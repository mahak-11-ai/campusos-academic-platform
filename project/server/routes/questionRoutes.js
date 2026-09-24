import express from 'express';
import {
  getQuestions,
  getMyQuestions,
  askQuestion,
  answerQuestion,
} from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getQuestions);
router.get('/mine', protect, getMyQuestions);
router.post('/', protect, askQuestion);
router.put('/:id/answer', protect, answerQuestion);

export default router;
