import { Request, Response } from 'express';
import prisma from '../../data/prisma';

interface AuthRequest extends Request {
    user?: any;
}

export const createTeam = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const team = await prisma.team.create({
            data: {
                name,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: 'ADMIN',
                    },
                },
            },
            include: {
                members: true,
            },
        });

        res.status(201).json(team);
    } catch (error) {
        console.error('Create Team Error:', error);
        res.status(500).json({ error: 'Failed to create team' });
    }
};

export const getMyTeams = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const members = await prisma.teamMember.findMany({
            where: { userId },
            include: {
                team: {
                    include: {
                        _count: {
                            select: { members: true, monitors: true }
                        }
                    }
                }
            }
        });

        const teams = members.map(m => ({ ...m.team, role: m.role }));
        res.json(teams);
    } catch (error) {
        console.error('Get Teams Error:', error);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
};

export const inviteMember = async (req: AuthRequest, res: Response) => {
    try {
        const { teamId } = req.params;
        const { email, role = 'MEMBER' } = req.body;
        const requesterId = req.user.id;

        // Verify requester is admin/owner
        const member = await prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId,
                    userId: requesterId,
                },
            },
        });

        if (!member || member.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Only admins can invite members' });
        }

        // Find user to invite
        const userToInvite = await prisma.user.findUnique({ where: { email } });
        if (!userToInvite) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already member
        const existingMember = await prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId,
                    userId: userToInvite.id,
                },
            },
        });

        if (existingMember) {
            return res.status(400).json({ error: 'User is already a member' });
        }

        // Add member
        const newMember = await prisma.teamMember.create({
            data: {
                teamId,
                userId: userToInvite.id,
                role,
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        res.status(201).json(newMember);
    } catch (error) {
        console.error('Invite Error:', error);
        res.status(500).json({ error: 'Failed to invite member' });
    }
};

export const getTeamMembers = async (req: AuthRequest, res: Response) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        // Verify membership
        const member = await prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId,
                    userId,
                },
            },
        });

        if (!member) {
            return res.status(403).json({ error: 'Not a member of this team' });
        }

        const members = await prisma.teamMember.findMany({
            where: { teamId },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        res.json(members);
    } catch (error) {
        console.error('Get Members Error:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};
