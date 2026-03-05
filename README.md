# API Pulse - AI Infrastructure Monitoring Platform

A comprehensive SaaS platform designed to monitor AI infrastructure, track incidents, and provide real-time status updates.

## 🚀 Project Overview

API Pulse consists of two main components orchestrated with Docker:
- **`api-monitor-frontend`**: A modern React dashboard for visualizing system health and managing monitors.
- **`api-service`**: A robust Node.js/TypeScript backend API that handles authentication, monitoring logic, and incident tracking.

## 🌍 Global Deployment

Want to make **API Pulse** accessible to anyone in the world via a single link (like `google.com`)?
Check our [Global Deployment Guide](./DEPLOYMENT.md) for step-by-step instructions on hosting with Vercel, Render, and Supabase.

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
    - **Docker Setup**:
        - Frontend: [http://localhost:80](http://localhost:80)
        - Backend: [http://localhost:5000](http://localhost:5000)
    - **Manual Dev Setup** (after running `npm run dev`):
        - Frontend: [http://localhost:5173](http://localhost:5173)
        - Backend: [http://localhost:5000](http://localhost:5000)


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

---

## ✅ Summary of Everything Done (API Pulse Deployment)

I have successfully completed full deployment and debugging of the **API Pulse – AI Infrastructure Monitoring Platform** across Render, Supabase, and Vercel. Below is a complete breakdown of setup, issues faced, fixes applied, and final working configuration.

---

### 🔹 1. Final Architecture (Working)

- **Frontend:** Vercel (React + Vite)
- **Backend:** Render (Node.js + Express + TypeScript + Prisma)
- **Database:** Supabase (PostgreSQL)

**Flow:**
```
Frontend (Vercel) → Backend API (Render) → Prisma ORM → Supabase PostgreSQL
```

---

### 🔹 2. Deployment Details

#### Backend (Render)
- **Environment Variables:** `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`, `JWT_SECRET`.
- **Build Command:** `npm install && npx prisma migrate deploy && npx prisma generate && npm run build`

#### Frontend (Vercel)
- **Root Directory:** `api-monitor-frontend`
- **Environment Variable:** `VITE_API_URL = https://api-pulse-ue7e.onrender.com`

#### Database (Supabase)
- **Connection:** Pooled PostgreSQL connection string used in Render.

---

### 🔹 3. Major Issues Faced + Fixes

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **Wrong Prisma DB** | Prisma switched to SQLite for local setup | Reverted schema to `postgresql` |
| **Missing Migrations** | Tables didn't exist in production | Added `npx prisma migrate deploy` to build command |
| **Render Path Errors** | Incorrect `cd` in build command | Removed `cd` as Render starts in the root |
| **CORS Errors** | Frontend blocked by backend | Updated CORS policy to include Vercel and production domains |
| **Auth API Mismatch** | Response structure didn't match frontend | Updated controllers to return `{ token, user }` |
| **Git Conflicts** | Push rejection/Rebase issues | Resolved via `git pull --rebase` |

---

### 🔹 4. Structural Improvements

- Unified middleware into `src/api/middleware`.
- Removed duplicate middleware folders.
- Cleaned and standardized imports across the backend.

---

### 🔹 5. Final Status
- ✅ Backend builds successfully
- ✅ DB connected correctly
- ✅ Migrations applied
- ✅ Auth works
- ✅ Frontend communicates properly
- ✅ Deployment stable
