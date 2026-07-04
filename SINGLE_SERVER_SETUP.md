# Single Server Setup Guide

This application is now configured to run as a **single consolidated server** that serves both the backend API and frontend UI.

## Architecture

- **Backend Express Server**: Serves API routes at `/api/*` and static frontend files at root
- **Frontend Build**: Built React app in `frontend/dist` served as static files
- **Database**: MongoDB (cloud or local)

## Development Setup

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB connection string in `.env`
- All env vars configured (see [.env.example](.env.example))

### 2. Build Frontend
Build the frontend to generate the `dist` folder that the backend will serve:
```bash
cd frontend
npm install
npm run build
```

### 3. Run Backend
The backend automatically serves the frontend build from the root path while serving API calls at `/api`:
```bash
cd backend
npm install
PORT=5000 node server.js
```

The server will start and:
- ✅ Serve the frontend at `http://localhost:5000/` (index.html)
- ✅ Handle API calls at `http://localhost:5000/api/*`
- ✅ Serve static assets (CSS, JS, images) from `frontend/dist/assets`
- ✅ Redirect SPA routes back to `index.html` (so `/doctors`, `/patient/dashboard`, etc. work)

### 4. Access the Application
- **Frontend**: http://localhost:5000/
- **API Health**: http://localhost:5000/api/health
- **Doctors List**: http://localhost:5000/doctors (served via frontend)
- **Doctor API**: http://localhost:5000/api/doctor

## Database Seeding

### Seed Sample Data
```bash
cd backend
npm run seed:data     # Seeds 25 doctors + 12 patients
npm run seed:doctors  # Seeds only doctors
npm run seed:patients # Seeds only patients
npm run seed:dry-run  # Validates data without writing
```

All passwords are hashed with bcrypt.
- Sample doctor password: `Doctor@101`, `Doctor@102`, etc.
- Sample patient password: `Patient@201`, `Patient@202`, etc.

## Docker Deployment

A single Dockerfile builds and runs the entire application:
```bash
docker build -t healthazon:latest .
docker run -e MONGO_URI='your_uri' -e JWT_SECRET='secret' -p 8080:8080 healthazon:latest
```

## Environment Variables

See [.env.example](.env.example) for all required and optional variables.

Key points for single-server:
- `VITE_RENDER_API=/api` — Frontend uses same-origin API (no need to change between dev/prod)
- `FRONTEND_URL` — Used for password reset links and emails

## Testing the Setup

### 1. Check Backend is Running
```bash
curl http://localhost:5000/api/health
```
Should return:
```json
{
  "message": "Healthazon API is running successfully",
  "version": "1.0.0",
  "status": "healthy"
}
```

### 2. Check Frontend is Served
```bash
curl http://localhost:5000/
```
Should return HTML (check for `<html>` tags in output)

### 3. Check Doctors API
```bash
curl http://localhost:5000/api/doctor
```
Should return array of doctor objects (if seeded)

### 4. Test in Browser
- Open http://localhost:5000/
- Navigate to **Doctors** link
- Should see a list of all seeded doctors

## Troubleshooting

### Frontend shows blank / 404
**Cause**: `frontend/dist` not found
```bash
cd frontend
npm run build
# Then restart backend
```

### Doctors list is empty
**Cause**: No data seeded
```bash
cd backend
npm run seed:dry-run  # Test first
npm run seed:data     # Actually seed
```

### API calls failing
**Cause**: `MONGO_URI` not set or backend not running
```bash
# Check .env has MONGO_URI
cat backend/../.env | grep MONGO_URI

# Restart backend with verbose output
cd backend
MONGO_URI='your_uri' PORT=5000 node server.js
```

### Port already in use
```bash
PORT=3000 node server.js  # Use a different port
```

## CI/CD Deployment (Cloud Run / Docker Registry)

Simply push the Docker image built from the root-level [Dockerfile](Dockerfile):

```bash
docker build -t your-registry/healthazon:latest .
docker push your-registry/healthazon:latest
```

Then deploy to Cloud Run (or any container platform) with required env vars:
- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `FRONTEND_URL`

The single image handles everything.
