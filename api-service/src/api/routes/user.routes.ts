import { Router } from 'express';
import { updateProfile, changePassword, uploadAvatar } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();



router.put('/profile', authenticate, updateProfile);
router.post('/profile/avatar', authenticate, upload.single('avatar'), uploadAvatar);
router.put('/password', authenticate, changePassword);

export default router;
