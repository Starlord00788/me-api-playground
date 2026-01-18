# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Backend Won't Start

#### Problem: "Database connection failed"
```bash
Error: P1001: Can't reach database server
```

**Solutions:**
1. **Check DATABASE_URL in .env file**
   ```bash
   # Make sure it's properly formatted
   DATABASE_URL="postgresql://username:password@host:5432/database"
   ```

2. **Use SQLite for testing**
   ```bash
   # In backend/.env
   DATABASE_URL="file:./dev.db"
   
   # In backend/prisma/schema.prisma
   provider = "sqlite"  # instead of "postgresql"
   
   # Then run
   npm run db:migrate
   npm run db:seed
   ```

3. **Test database connection**
   ```bash
   npx prisma db push
   ```

#### Problem: "Port already in use"
```bash
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Find and kill process using port 3001
netstat -ano | findstr :3001  # Windows
lsof -ti:3001 | xargs kill -9  # macOS/Linux

# Or change port in backend/.env
PORT=3002
```

### 2. Database Issues

#### Problem: "Table doesn't exist"
**Solution:**
```bash
cd backend
npm run db:migrate
```

#### Problem: "No data in database"
**Solution:**
```bash
cd backend
npm run db:seed
```

#### Problem: "Migration failed"
**Solution:**
```bash
# Reset database (development only)
npx prisma migrate reset

# Or force deploy
npx prisma migrate deploy --force
```

### 3. Frontend Issues

#### Problem: "API connection failed" in browser
**Solutions:**
1. **Check backend is running**
   - Visit: http://localhost:3001/health
   - Should return: `{"status": "ok"}`

2. **Check CORS configuration**
   ```javascript
   // In backend/src/app.js
   app.use(cors({
     origin: 'http://localhost:3000', // Should match frontend URL
     credentials: true
   }));
   ```

3. **Check API URL in frontend**
   ```javascript
   // In frontend/app.js
   const API_BASE_URL = 'http://localhost:3001'; // Should match backend
   ```

#### Problem: "Python not found" for frontend
**Solutions:**
```bash
# Option 1: Install Python
# Download from python.org

# Option 2: Use Node.js instead
npm install -g serve
cd frontend
serve .

# Option 3: Use VS Code Live Server extension
```

### 4. Environment Issues

#### Problem: "Environment variables not loading"
**Solution:**
```bash
# Make sure .env file is in backend/ directory
# Check file name (not .env.txt)
# Restart server after changes
```

#### Problem: "NODE_ENV not recognized"
**Solution:**
```bash
# For Windows PowerShell
$env:NODE_ENV="development"

# For Windows CMD
set NODE_ENV=development

# For macOS/Linux
export NODE_ENV=development
```

### 5. Development Setup

#### Problem: "npm command not found"
**Solution:**
```bash
# Install Node.js from nodejs.org
# Verify installation
node --version
npm --version
```

#### Problem: "Prisma command not found"
**Solution:**
```bash
# Install Prisma CLI globally
npm install -g prisma

# Or use npx
npx prisma --version
```

### 6. VS Code Tasks Issues

#### Problem: "Task failed to start"
**Solutions:**
1. **Check .vscode/tasks.json syntax**
2. **Verify file paths in tasks**
3. **Run commands manually first**
   ```bash
   # Test backend task
   cd backend && npm run dev
   
   # Test frontend task  
   cd frontend && python -m http.server 3000
   ```

### 7. Docker Issues

#### Problem: "Docker build failed"
**Solution:**
```bash
# Check Dockerfile syntax
# Build with verbose output
docker build -t me-api-playground . --progress=plain

# Check Docker daemon is running
docker version
```

#### Problem: "Docker compose failed"
**Solution:**
```bash
# Check docker-compose.yml syntax
docker-compose config

# Start services one by one
docker-compose up db
docker-compose up api
```

### 8. Deployment Issues

#### Problem: "Build failed on hosting platform"
**Solutions:**
1. **Check Node.js version**
   ```json
   // In package.json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

2. **Check environment variables**
   - DATABASE_URL
   - NODE_ENV
   - CORS_ORIGIN

3. **Check start command**
   ```json
   // In package.json
   "scripts": {
     "start": "node src/app.js"
   }
   ```

#### Problem: "Database migrations failed"
**Solution:**
```bash
# Use deploy command instead of dev
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Quick Diagnostics

### Run Health Check Script
```bash
# Windows
.\health-check.ps1

# macOS/Linux
./health-check.sh
```

### Manual Health Check
```bash
# 1. Check backend
curl http://localhost:3001/health

# 2. Check frontend
curl http://localhost:3000

# 3. Check database
cd backend && npx prisma studio
```

### Log Debugging
```bash
# Backend logs
cd backend && npm run dev

# Check specific errors
# - P1001: Database connection
# - P2002: Unique constraint  
# - ECONNREFUSED: Service not running
# - EADDRINUSE: Port in use
```

## Getting Help

### Check Documentation
1. **SETUP.md** - Initial setup
2. **README.md** - Complete documentation
3. **DEPLOYMENT.md** - Production deployment
4. **API-TESTING.md** - API testing

### Common Commands Summary
```bash
# Backend setup
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev

# Frontend setup
cd frontend
python -m http.server 3000

# Health checks
curl http://localhost:3001/health
curl http://localhost:3001/api/profile
```

### Still Having Issues?
1. Check the console/terminal output for specific error messages
2. Verify all prerequisites are installed (Node.js, database)
3. Try SQLite option for quickest setup
4. Check firewall/antivirus blocking ports
5. Restart your terminal/IDE after environment changes

**Most issues are related to database configuration. When in doubt, use SQLite for quick testing!**