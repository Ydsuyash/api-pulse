# AI Infrastructure Monitoring - API Service

## Setup

1.  **Environment Variables**:
    Copy `.env.example` to `.env` and fill in the values.
    ```bash
    cp .env.example .env
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Database Migration**:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```

## Docker

1.  **Build**:
    ```bash
    docker build -t monitoring-api .
    ```

2.  **Run**:
    ```bash
    docker run -p 3000:3000 --env-file .env monitoring-api
    ```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Create account & team
- `POST /api/v1/auth/login` - Login

### Monitors
- `POST /api/v1/monitors` - Create monitor
- `GET /api/v1/monitors` - List monitors
- `GET /api/v1/monitors/:id` - Get detail
- `PATCH /api/v1/monitors/:id` - Update
- `DELETE /api/v1/monitors/:id` - Delete

### Incidents
- `GET /api/v1/incidents` - List incidents (filter by status)
- `GET /api/v1/incidents/:id` - Get detail
