# 🌍 Global Deployment Guide - API Pulse

Follow these steps to make **API Pulse** accessible to anyone in the world via a single link.

## 1. Database (Supabase)
We need a cloud database because the local `dev.db` file cannot be shared.

1.  Go to [Supabase](https://supabase.com/) and create a free account.
2.  Create a new project named `api-pulse`.
3.  Go to **Project Settings > Database** and copy the **Connection string (URI)**.
4.  It should look like: `postgresql://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres`
5.  **Save this URL.** You will need it for the Backend setup.

## 2. Backend API (Render)
This hosts your Express server.

1.  Create a free account on [Render](https://render.com/).
2.  Click **New + > Web Service**.
3.  Connect your GitHub repository and select the `api-pulse` repo.
4.  **Settings**:
    - **Root Directory**: `api-service`
    - **Build Command**: `npm install && npx prisma generate && npm run build`
    - **Start Command**: `npx prisma migrate deploy && npm start`
5.  **Environment Variables** (Add these in the "Env Vars" tab):
    - `DATABASE_URL`: (The URI from Supabase)
    - `JWT_SECRET`: (Create a random long string)
    - `PORT`: `5000`
    - `CLIENT_URL`: (Your Vercel URL - you can update this later)
6.  **Deploy**. Render will give you a URL like `https://api-pulse-backend.onrender.com`.

## 3. Frontend Dashboard (Vercel)
This hosts your React app.

1.  Go to [Vercel](https://vercel.com/) and connect your GitHub.
2.  Import the `api-pulse` repository.
3.  **Settings**:
    - **Root Directory**: `api-monitor-frontend`
    - **Framework Preset**: `Vite`
4.  **Environment Variables**:
    - `VITE_API_URL`: `https://your-render-backend-url.onrender.com` (Use the URL from Step 2)
5.  **Deploy**. Vercel will give you a link like `https://api-pulse.vercel.app`.

## 4. Final Connection
1.  Go back to **Render > Environment Variables**.
2.  Set `CLIENT_URL` to your Vercel URL (e.g., `https://api-pulse.vercel.app`).
3.  Render will auto-redeploy.

---

## ✅ You're Done!
Your app is now live. Anyone can visit your Vercel link, register, and start monitoring APIs.

> [!TIP]
> **Custom Domain**: If you want `yourname.com`, go to Vercel **Settings > Domains** and follow the instructions to connect a domain you own.
