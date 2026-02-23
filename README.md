# API Pulse - AI Infrastructure Monitoring Platform

A comprehensive SaaS platform designed to monitor AI infrastructure, track incidents, and provide real-time status updates.

## 🚀 Project Overview

API Pulse consists of two main components orchestrated with Docker:
- **`api-monitor-frontend`**: A modern React dashboard for visualizing system health and managing monitors.
- **`api-service`**: A robust Node.js/TypeScript backend API that handles authentication, monitoring logic, and incident tracking.

## 🛠 Tech Stack

### Backend (`api-service`)
- **Node.js & Express** with **TypeScript**
- **Prisma ORM** for database management
- **JWT & Bcrypt** for secure authentication
- **Socket.io** for real-time updates
- **Winston** for logging & **Zod** for validation

### Frontend (`api-monitor-frontend`)
- **React 19** with **TypeScript**
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

## 📦 Quick Start with Docker

The easiest way to get the entire platform running is using Docker Compose.

1.  **Clone the repository** (if you haven't already).
2.  **Run with Docker**:
    ```bash
    docker-compose up --build
    ```
3.  **Access the apps**:
    - **Frontend**: [http://localhost:80](http://localhost:80)
    - **Backend API**: [http://localhost:5000](http://localhost:5000)

## 🔧 Manual Setup

### Backend Setup
1. `cd api-service`
2. `npm install`
3. Copy `.env.example` to `.env` and configure your database.
4. `npx prisma migrate dev`
5. `npm run dev`

### Frontend Setup
1. `cd api-monitor-frontend`
2. `npm install`
3. `npm run dev`

## 📡 API Endpoints Summary

### Auth
- `POST /api/v1/auth/register` - Create account & team
- `POST /api/v1/auth/login` - Login

### Monitors
- `GET /api/v1/monitors` - List monitors
- `POST /api/v1/monitors` - Create a new monitor
- `PATCH /api/v1/monitors/:id` - Update monitor details

### Incidents
- `GET /api/v1/incidents` - List all incidents
- `GET /api/v1/incidents/:id` - Get incident details
