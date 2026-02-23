import { Request, Response, NextFunction } from 'express';
import prisma from '../../data/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const incidents = await prisma.incident.findMany({
            where: {
                monitor: { userId }
            },
            include: {
                monitor: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching incidents', error });
    }
};

export const getIncidentById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        // Fetch Incident & Monitor
        const incident = await prisma.incident.findFirst({
            where: {
                id,
                monitor: { userId }
            },
            include: {
                monitor: {
                    select: { id: true, name: true, url: true, interval: true }
                }
            }
        });

        if (!incident) {
            res.status(404).json({ message: 'Incident not found' });
            return;
        }

        const monitorId = incident.monitorId;

        // Fetch Last 10 Checks
        const last10Checks = await prisma.checkResult.findMany({
            where: { monitorId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Helper for Uptime Calculation
        const calculateUptime = async (hours: number) => {
            const since = new Date(Date.now() - hours * 60 * 60 * 1000);
            const totalChecks = await prisma.checkResult.count({
                where: {
                    monitorId,
                    createdAt: { gte: since }
                }
            });

            if (totalChecks === 0) return 100;

            const upChecks = await prisma.checkResult.count({
                where: {
                    monitorId,
                    createdAt: { gte: since },
                    status: 'UP'
                }
            });

            return (upChecks / totalChecks) * 100;
        };

        const uptime24h = await calculateUptime(24);
        const uptime7d = await calculateUptime(24 * 7);
        const totalChecks24h = await prisma.checkResult.count({
            where: {
                monitorId,
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        });

        res.json({
            ...incident,
            history: {
                last10Checks,
                uptime24h: Number(uptime24h.toFixed(2)),
                uptime7d: Number(uptime7d.toFixed(2)),
                totalChecks24h
            }
        });

    } catch (error) {
        console.error('Error fetching incident details:', error);
        res.status(500).json({ message: 'Error fetching incident details', error });
    }
};

export const acknowledgeIncident = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const incident = await prisma.incident.findFirst({
            where: {
                id,
                monitor: { userId }
            }
        });

        if (!incident) {
            res.status(404).json({ message: 'Incident not found' });
            return;
        }

        if (incident.status === 'Resolved') {
            res.status(400).json({ message: 'Cannot acknowledge a resolved incident' });
            return;
        }

        if (incident.status === 'Acknowledged') {
            res.json(incident); // Idempotent
            return;
        }

        const updatedIncident = await prisma.incident.update({
            where: { id },
            data: { status: 'Acknowledged' }
        });

        res.json(updatedIncident);
    } catch (error) {
        res.status(500).json({ message: 'Error acknowledging incident', error });
    }
};
