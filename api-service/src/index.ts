import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './api/routes/auth.routes';
import monitorRoutes from './api/routes/monitor.routes';
import incidentRoutes from './api/routes/incident.routes';
import dashboardRoutes from './api/routes/dashboard.routes';
import analyticsRoutes from './api/routes/analytics.routes';
import statusPageRoutes from './api/routes/status-page.routes';
import teamRoutes from './api/routes/team.routes';
import userRoutes from './api/routes/user.routes';
import { initScheduler } from './monitoring/monitoring.service';

import http from 'http';
import { socketService } from './services/socket.service';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        process.env.FRONTEND_URL as string
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    next();
});
app.use(express.json());

// Initialize Socket.io
socketService.init(httpServer);

// Static files
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/monitors', monitorRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/public', statusPageRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/user', userRoutes);

app.get('/', (req, res) => {
    res.send('AI Infrastructure Monitoring API is running');
});

// Start Scheduler
initScheduler();

httpServer.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
