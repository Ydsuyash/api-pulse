import { z } from 'zod';

export const createMonitorSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        url: z.string().url(),
        type: z.enum(['HTTP', 'PING', 'TCP']).optional(),
        interval: z.string().optional(),
    }),
});

export const updateMonitorSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        url: z.string().url().optional(),
        type: z.enum(['HTTP', 'PING', 'TCP']).optional(),
        interval: z.string().optional(),
        status: z.enum(['UP', 'DOWN', 'PAUSED']).optional(),
    }),
});
