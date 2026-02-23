import { Request, Response } from 'express';
import prisma from '../../data/prisma';

export const getMonitorMetrics = async (req: Request, res: Response) => {
    const { monitorId } = req.params;
    const { range = '24h' } = req.query; // 1h, 24h, 7d, 30d

    try {
        const now = new Date();
        let startDate = new Date();

        switch (range) {
            case '1h':
                startDate.setHours(now.getHours() - 1);
                break;
            case '24h':
                startDate.setHours(now.getHours() - 24);
                break;
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            default:
                startDate.setHours(now.getHours() - 24);
        }

        // Fetch check results
        const checkResults = await prisma.checkResult.findMany({
            where: {
                monitorId,
                createdAt: {
                    gte: startDate,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
            select: {
                createdAt: true,
                latency: true,
                status: true,
            },
        });

        // Calculate Uptime
        const totalChecks = checkResults.length;
        const upChecks = checkResults.filter((r) => r.status === 'UP').length;
        const uptimePercentage = totalChecks > 0 ? (upChecks / totalChecks) * 100 : 0;

        // Latency Data for Chart (downsample if needed, but for now raw is fine for small ranges)
        const latencyData = checkResults.map((r) => ({
            time: r.createdAt,
            latency: r.latency,
            status: r.status,
        }));

        res.json({
            uptimePercentage: parseFloat(uptimePercentage.toFixed(2)),
            latencyData,
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};
