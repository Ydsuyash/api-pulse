import { Router } from 'express';
import { getPublicStatus } from '../controllers/status-page.controller';

const router = Router();

// GET /api/v1/public/status
router.get('/status', getPublicStatus);

export default router;
