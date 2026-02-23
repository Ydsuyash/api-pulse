import { Request, Response } from 'express';
import prisma from '../../data/prisma';

export const getPublicStatus = async (req: Request, res: Response) => {
    try {
        // Fetch all active monitors
        const monitors = await prisma.monitor.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                url: true, // Maybe hide this if sensitive, but usually status pages show it
                status: true,
                lastChecked: true,
                type: true,
            },
        });

        // Calculate overall system status
        const totalMonitors = monitors.length;
        const upMonitors = monitors.filter((m) => m.status === 'UP').length;

        let systemStatus = 'Operational';
        if (totalMonitors > 0) {
            if (upMonitors === 0) systemStatus = 'Major Outage';
            else if (upMonitors < totalMonitors) systemStatus = 'Partial Outage';
        }

        // Get Incident History (last 5 resolved or open)
        const recentIncidents = await prisma.incident.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                type: true,
                status: true,
                description: true,
                createdAt: true,
                resolvedAt: true,
                monitor: {
                    select: { name: true }
                }
            }
        });

        res.json({
            systemStatus,
            monitors,
            recentIncidents,
            lastUpdated: new Date(),
        });
    } catch (error) {
        console.error('Error fetching public status:', error);
        res.status(500).json({ error: 'Failed to fetch status' });
    }
};
