# 🚀 Quick Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database (local or cloud)

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
# Copy and edit .env file
cp .env.example .env

# Edit .env with your database URL:
# DATABASE_URL="postgresql://username:password@localhost:5432/meapi"
```

### 3. Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start Development
```bash
# Terminal 1: Backend API
npm run dev

# Terminal 2: Frontend (from frontend folder)
cd ../frontend
python -m http.server 3000
```

### 5. Test the API
- Backend: http://localhost:3001/health
- Frontend: http://localhost:3000

## 🌐 Database Options

### Option 1: SQLite (Easiest - No Setup Required)
```bash
# 1. Update backend/.env
DATABASE_URL="file:./dev.db"

# 2. Update backend/prisma/schema.prisma
# Change: provider = "postgresql" 
# To:     provider = "sqlite"

# 3. Run setup
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Option 2: Local PostgreSQL
Install PostgreSQL locally and create a database named `meapi`.

### Option 3: Free Cloud Database
- **Neon**: https://neon.tech (Free tier)
- **Railway**: https://railway.app (Free tier)  
- **Supabase**: https://supabase.com (Free tier)

### Option 4: Docker (Quick PostgreSQL)
```bash
docker-compose up db
# Then use: DATABASE_URL="postgresql://postgres:password@localhost:5432/meapi"
```

## 🎯 What's Included
- ✅ Complete REST API
- ✅ Database schema & migrations
- ✅ Sample candidate data
- ✅ Modern frontend interface
- ✅ Docker support
- ✅ Deployment ready

## 🚨 Need Help?
Check the detailed README.md for troubleshooting and deployment guides.