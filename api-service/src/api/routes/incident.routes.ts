import { Router } from 'express';
import { list as getIncidents, getIncidentById, acknowledgeIncident } from '../controllers/incident.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// @ts-ignore
router.get('/', authenticate, getIncidents);
// @ts-ignore
router.get('/:id', authenticate, getIncidentById);
// @ts-ignore
router.patch('/:id/acknowledge', authenticate, acknowledgeIncident);

export default router;
