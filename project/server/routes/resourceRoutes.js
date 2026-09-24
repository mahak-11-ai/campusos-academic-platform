import express from 'express';
import {
  getResources,
  getLatestResources,
  getResource,
  getMyResources,
  createResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getResources);
router.get('/latest', protect, getLatestResources);
router.get('/mine', protect, getMyResources);
router.get('/:id', protect, getResource);
router.post('/', protect, authorize('teacher'), upload.single('file'), createResource);
router.delete('/:id', protect, authorize('teacher'), deleteResource);

export default router;
