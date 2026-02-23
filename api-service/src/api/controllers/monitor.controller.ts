import { Request, Response } from 'express';
import prisma from '../../data/prisma';
import { AuthRequest } from '../middleware/auth.middleware';


export const createMonitor = async (req: AuthRequest, res: Response) => {
    try {
        const { name, url, interval } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const monitor = await prisma.monitor.create({
            data: {
                name,
                url,
                interval,
                userId,
                type: req.body.type || 'HTTP',
                isActive: req.body.isActive !== undefined ? req.body.isActive : true
            },
        });

        res.status(201).json(monitor);
    } catch (error) {
        res.status(500).json({ message: 'Error creating monitor', error });
    }
};

export const getMonitors = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const monitors = await prisma.monitor.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        res.json(monitors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching monitors', error });
    }
};

export const updateMonitor = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, url, interval, status, isActive } = req.body;
        const userId = req.user?.userId;

        const monitor = await prisma.monitor.findFirst({
            where: { id, userId },
        });

        if (!monitor) {
            res.status(404).json({ message: 'Monitor not found' });
            return;
        }

        const updatedMonitor = await prisma.monitor.update({
            where: { id },
            data: { name, url, interval, status, isActive },
        });

        res.json(updatedMonitor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating monitor', error });
    }
};

export const deleteMonitor = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const monitor = await prisma.monitor.findFirst({
            where: { id, userId },
        });

        if (!monitor) {
            res.status(404).json({ message: 'Monitor not found' });
            return;
        }

        await prisma.monitor.delete({ where: { id } });

        res.json({ message: 'Monitor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting monitor', error });
    }
};

export const getMonitor = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const monitor = await prisma.monitor.findFirst({
            where: { id, userId },
        });

        if (!monitor) {
            res.status(404).json({ message: 'Monitor not found' });
            return;
        }

        res.json(monitor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching monitor', error });
    }
};
