import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// @ts-ignore
router.get('/stats', (req, res, next) => {
    // Attempt to authenticate but don't fail if no token
    const authHeader = req.headers.authorization;
    if (authHeader) {
        return authenticate(req, res, next);
    }
    next();
}, getStats);

export default router;
