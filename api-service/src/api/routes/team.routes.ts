import { Router } from 'express';
import { createTeam, getMyTeams, inviteMember, getTeamMembers } from '../controllers/team.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // ALl team routes require auth

router.post('/', createTeam as any);
router.get('/', getMyTeams as any);
router.post('/:teamId/invite', inviteMember as any);
router.get('/:teamId/members', getTeamMembers as any);

export default router;
