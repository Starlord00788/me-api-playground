#!/bin/bash

# Quick Health Check Script for Me-API Playground

echo "🔍 Me-API Playground Health Check"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project directory structure looks good"

# Check backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install
    cd ..
fi

echo "✅ Backend dependencies installed"

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creating .env file from .env.example..."
    cp backend/.env.example backend/.env
fi

echo "✅ Environment file exists"

# Check if database URL is configured
if grep -q "username:password@localhost" backend/.env; then
    echo "⚠️  WARNING: Database URL contains placeholder values"
    echo "   Please update DATABASE_URL in backend/.env with real credentials"
    echo "   OR use SQLite for quick testing:"
    echo "   DATABASE_URL=\"file:./dev.db\""
fi

# Test backend server
echo "🚀 Testing backend server..."
cd backend

# Check if we can start the server
timeout 10s npm run dev &
SERVER_PID=$!

sleep 3

# Test health endpoint
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend server is healthy"
else
    echo "❌ Backend server health check failed"
    echo "   Check the logs above for database connection issues"
fi

# Stop the server
kill $SERVER_PID 2>/dev/null

cd ..

echo ""
echo "🎯 Quick Start Commands:"
echo "   Backend: cd backend && npm run dev"
echo "   Frontend: cd frontend && python -m http.server 3000"
echo ""
echo "📚 For detailed setup instructions, see SETUP.md"