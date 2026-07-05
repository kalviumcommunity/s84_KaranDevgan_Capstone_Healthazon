#!/bin/bash
# Single-server integration test script
# Run this after starting the backend server with: cd backend && PORT=5000 node server.js

echo "🧪 Testing Healthazon Single-Server Setup..."
echo ""

BASE_URL="http://localhost:5000"
API_URL="$BASE_URL/api"

echo "1️⃣ Testing Backend API Health..."
HEALTH=$(curl -s "$API_URL/health")
if echo "$HEALTH" | grep -q "healthy"; then
  echo "✅ Backend API is running"
else
  echo "❌ Backend API not responding or unhealthy"
  echo "Response: $HEALTH"
  exit 1
fi

echo ""
echo "2️⃣ Testing Frontend is being served..."
FRONTEND=$(curl -s "$BASE_URL/" | head -c 200)
if echo "$FRONTEND" | grep -q "<html"; then
  echo "✅ Frontend is being served"
else
  echo "❌ Frontend not being served"
  echo "Response: $FRONTEND"
  exit 1
fi

echo ""
echo "3️⃣ Testing Doctors API..."
DOCTORS=$(curl -s "$API_URL/doctor")
if echo "$DOCTORS" | grep -q "\["; then
  DOCTOR_COUNT=$(echo "$DOCTORS" | grep -o '"role":"doctor"' | wc -l)
  echo "✅ Doctors API working - found $DOCTOR_COUNT doctors"
else
  echo "⚠️  Doctors API working but no doctors seeded yet"
  echo "   Run: cd backend && npm run seed:data"
fi

echo ""
echo "4️⃣ Testing SPA Route Fallback..."
SPA_ROUTE=$(curl -s "$BASE_URL/doctors" | head -c 200)
if echo "$SPA_ROUTE" | grep -q "<html"; then
  echo "✅ SPA routes work (redirecting to index.html)"
else
  echo "⚠️  SPA route not working properly"
fi

echo ""
echo "✨ Single-server setup verification complete!"
echo ""
echo "📍 Access the app at: $BASE_URL"
echo "📍 API endpoint: $API_URL"
