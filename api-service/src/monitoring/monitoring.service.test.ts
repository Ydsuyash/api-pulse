import { checkMonitors } from './monitoring.service';
import prisma from '../data/prisma';
import axios from 'axios';
import { emailService } from '../services/email.service';

// Mock dependencies
jest.mock('../data/prisma', () => ({
    monitor: {
        findMany: jest.fn(),
        update: jest.fn(),
    },
    incident: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
    },
    checkResult: {
        create: jest.fn(),
    },
}));

jest.mock('axios');
jest.mock('../services/email.service', () => ({
    emailService: {
        sendAlertEmail: jest.fn(),
    },
}));

describe('Monitoring Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle UP monitor correctly', async () => {
        const mockMonitor = {
            id: '1',
            name: 'Test Monitor',
            url: 'http://example.com',
            type: 'HTTP',
            status: 'UP',
            interval: '1m',
        };

        (prisma.monitor.findMany as jest.Mock).mockResolvedValue([mockMonitor]);
        (axios.get as jest.Mock).mockResolvedValue({ status: 200, headers: {}, data: {} });
        (prisma.incident.findFirst as jest.Mock).mockResolvedValue(null);

        await checkMonitors();

        expect(axios.get).toHaveBeenCalledWith('http://example.com', expect.any(Object));
        expect(prisma.checkResult.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                status: 'UP',
                monitorId: '1',
            }),
        }));
        expect(prisma.monitor.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: '1' },
            data: expect.objectContaining({ status: 'UP' }),
        }));
    });

    it('should create incident when monitor goes DOWN', async () => {
        const mockMonitor = {
            id: '2',
            name: 'Failing Monitor',
            url: 'http://fail.com',
            type: 'HTTP',
            status: 'UP',
            interval: '1m',
        };

        (prisma.monitor.findMany as jest.Mock).mockResolvedValue([mockMonitor]);
        (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));
        (prisma.incident.create as jest.Mock).mockResolvedValue({ id: 'inc-1' });

        await checkMonitors();

        expect(prisma.checkResult.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                status: 'DOWN',
                monitorId: '2',
            }),
        }));
        expect(prisma.monitor.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: '2' },
            data: expect.objectContaining({ status: 'DOWN' }),
        }));
        expect(prisma.incident.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                monitorId: '2',
                status: 'Open',
            }),
        }));
        expect(emailService.sendAlertEmail).toHaveBeenCalledWith(
            'Failing Monitor',
            'http://fail.com',
            'DOWN',
            'inc-1'
        );
    });

    it('should resolve incident when monitor comes back UP', async () => {
        const mockMonitor = {
            id: '3',
            name: 'Recovering Monitor',
            url: 'http://recover.com',
            type: 'HTTP',
            status: 'DOWN',
            interval: '1m',
        };

        const mockIncident = { id: 'inc-2', status: 'Open' };

        (prisma.monitor.findMany as jest.Mock).mockResolvedValue([mockMonitor]);
        (axios.get as jest.Mock).mockResolvedValue({ status: 200, headers: {}, data: {} });
        (prisma.incident.findFirst as jest.Mock).mockResolvedValue(mockIncident);
        (prisma.incident.update as jest.Mock).mockResolvedValue({});

        await checkMonitors();

        expect(prisma.monitor.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: '3' },
            data: expect.objectContaining({ status: 'UP' }),
        }));
        expect(prisma.incident.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 'inc-2' },
            data: expect.objectContaining({ status: 'Resolved' }),
        }));
    });
});
