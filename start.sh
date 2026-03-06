#!/bin/bash

# Kill running processes on ports 9090 and 4200 just in case
echo "Cleaning up ports..."
lsof -ti:9090 | xargs kill -9 2>/dev/null
lsof -ti:4200 | xargs kill -9 2>/dev/null

# Set Java Path for parsing
export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"

echo "☕️ Starting Backend (Spring Boot)..."
cd demo
./mvnw spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "Waiting for Backend to initialize..."
sleep 10

echo "🎨 Starting Frontend (Angular)..."
cd front
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "✅ Application started!"
echo "Backend logging to: backend.log"
echo "Frontend logging to: frontend.log"
echo "👉 Open http://localhost:4200"

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Keep script running
wait
