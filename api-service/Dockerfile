# Base stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Builder stage
FROM base AS builder
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# Copy the built query engine for the production platform (alpine/linux-musl)
COPY --from=builder /app/node_modules/.prisma/client/ /app/node_modules/.prisma/client/

EXPOSE 5000

# Start command
# We use npx prisma migrate deploy to ensure DB is up to date on start (for SQLite/Postgres)
# But for SQLite file, we might need to be careful about volume mounting. 
# For now, simpler start:
CMD ["npm", "start"]
