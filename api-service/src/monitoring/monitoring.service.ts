
import cron from 'node-cron';
import axios from 'axios';
import prisma from '../data/prisma';
import { socketService } from '../services/socket.service';
import { emailService } from '../services/email.service';

export const initScheduler = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        console.log('Running monitor checks...');
        await checkMonitors();
    });
};

export const checkMonitors = async () => {
    try {
        const monitors = await prisma.monitor.findMany({
            where: { isActive: true },
        });

        for (const monitor of monitors) {
            await checkMonitor(monitor);
        }
    } catch (error) {
        console.error('Error in monitor scheduler:', error);
    }
};

const checkMonitor = async (monitor: any) => {
    const startTime = Date.now();
    let status = 'DOWN';
    let latency = 0;

    try {
        console.log(`Checking ${monitor.name} (${monitor.url})...`);
        const response = await axios.get(monitor.url, { timeout: 5000 });
        if (response.status >= 200 && response.status < 300) {
            status = 'UP';
        }
        latency = Date.now() - startTime;
    } catch (error) {
        // If error (timeout, 404, 500), status remains DOWN
        console.error(`Check failed for ${monitor.name}:`, error instanceof Error ? error.message : error);
        latency = Date.now() - startTime;
    }

    // Update Monitor Status
    const updatedMonitor = await prisma.monitor.update({
        where: { id: monitor.id },
        data: {
            status,
            latency,
            lastChecked: new Date(),
        },
    });

    // Log Check Result
    await prisma.checkResult.create({
        data: {
            monitorId: monitor.id,
            status,
            latency,
            statusCode: status === 'UP' ? 200 : 0,
            error: status === 'DOWN' ? 'Check failed' : null
        }
    });

    // Emit Socket Event
    socketService.emit('monitor:update', updatedMonitor);



    // Handle Incident Logic
    if (monitor.status === 'UP' && status === 'DOWN') {
        // Create Incident
        console.log(`Monitor ${monitor.name} went DOWN. Creating incident...`);
        const incident = await prisma.incident.create({
            data: {
                type: 'DOWN',
                severity: 'Critical',
                status: 'Open',
                description: `Monitor ${monitor.name} is unreachable.`,
                monitorId: monitor.id,
            },
        });

        // Send Alert Email
        emailService.sendAlertEmail(monitor.name, monitor.url, 'DOWN', incident.id);

    } else if (monitor.status === 'DOWN' && status === 'UP') {
        // Resolve Incident
        console.log(`Monitor ${monitor.name} is back UP. Resolving incidents...`);
        const openIncident = await prisma.incident.findFirst({
            where: {
                monitorId: monitor.id,
                status: 'Open',
            },
        });

        if (openIncident) {
            await prisma.incident.update({
                where: { id: openIncident.id },
                data: {
                    status: 'Resolved',
                    resolvedAt: new Date(),
                },
            });

            // Send Recovery Email (Optional but good UX)
            // emailService.sendAlertEmail(monitor.name, monitor.url, 'UP (Recovered)', openIncident.id);
        }
    }
};
