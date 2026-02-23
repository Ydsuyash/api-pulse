import { Router } from 'express';
import { updateProfile, changePassword, uploadAvatar } from '../controllers/user.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();


import { upload } from '../../middlewares/upload.middleware';

router.put('/profile', authenticate, updateProfile);
router.post('/profile/avatar', authenticate, upload.single('avatar'), uploadAvatar);
router.put('/password', authenticate, changePassword);

export default router;
