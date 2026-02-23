import { Request, Response } from 'express';
import prisma from '../../data/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const [totalMonitors, upMonitors, incidents, latencyAgg] = await Promise.all([
            prisma.monitor.count({ where: { userId } }),
            prisma.monitor.count({ where: { userId, status: 'UP' } }),
            prisma.incident.findMany({
                where: {
                    monitor: { userId },
                    status: 'Open'
                }
            }),
            prisma.monitor.aggregate({
                where: { userId, isActive: true },
                _avg: { latency: true }
            })
        ]);

        const activeIncidents = incidents.length;
        const uptime = totalMonitors > 0 ? ((upMonitors / totalMonitors) * 100).toFixed(1) + '%' : '100%';
        const avgLatency = latencyAgg._avg.latency ? Math.round(latencyAgg._avg.latency) + 'ms' : '0ms';

        res.json({
            totalMonitors,
            activeIncidents,
            uptime,
            avgLatency
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};
