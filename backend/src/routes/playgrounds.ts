import express from 'express';
import {
  getAllPlaygrounds,
  getPlaygroundById,
  createPlayground,
  updatePlayground,
  deletePlayground
} from '../controllers/playgroundController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllPlaygrounds);
router.get('/:id', getPlaygroundById);
router.post('/', authenticateToken, createPlayground);
router.put('/:id', authenticateToken, updatePlayground);
router.delete('/:id', authenticateToken, deletePlayground);

export default router;