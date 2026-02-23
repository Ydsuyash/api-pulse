import { Router } from 'express';
import { createMonitor as create, getMonitors as list, getMonitor as get, updateMonitor as update, deleteMonitor as remove } from '../controllers/monitor.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createMonitorSchema, updateMonitorSchema } from '../../schemas/monitor.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createMonitorSchema), create);
router.get('/', list);
router.get('/:id', get);
router.patch('/:id', validate(updateMonitorSchema), update);
router.delete('/:id', remove);

export default router;
