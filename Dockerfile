# Multi-stage Dockerfile to build frontend and run backend as single service
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Install frontend deps and build
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install --legacy-peer-deps
COPY frontend ./frontend
RUN cd frontend && npm run build

### Production image
FROM node:18-alpine
WORKDIR /app

# Install backend deps (production only)
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production --legacy-peer-deps

# Copy backend source
COPY backend ./backend

# Copy built frontend from build stage
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
WORKDIR /app/backend

# Cloud Run sets PORT env automatically; expose a default for local runs
EXPOSE 8080

CMD ["node", "server.js"]
