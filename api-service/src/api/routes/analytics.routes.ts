import { Router } from 'express';
import { getMonitorMetrics } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET /api/analytics/:monitorId/metrics
router.get('/:monitorId/metrics', authenticate, getMonitorMetrics as any);

export default router;
