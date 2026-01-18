# 🌐 Deployment Guide

Complete guide for deploying Me-API Playground to various platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended)
**Total Time: ~5 minutes**

1. **Setup Database**:
   - Go to [railway.app](https://railway.app)
   - Create new project → Add PostgreSQL
   - Copy the DATABASE_URL

2. **Deploy Backend**:
   - Connect your GitHub repo
   - Set environment variables:
     ```
     DATABASE_URL=your-railway-postgres-url
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-domain.netlify.app
     ```
   - Railway auto-detects Node.js and deploys

3. **Deploy Frontend**:
   - Connect frontend folder to [Netlify](https://netlify.com)
   - Update `frontend/app.js` with your API URL
   - Deploy automatically

### Option 2: Render + Netlify
**Total Time: ~7 minutes**

1. **Backend on Render**:
   - Go to [render.com](https://render.com)
   - Create Web Service from GitHub
   - Settings:
     ```
     Build Command: cd backend && npm install
     Start Command: cd backend && npm start
     Environment: Node
     ```
   - Add environment variables:
     ```
     DATABASE_URL=your-postgres-url
     NODE_ENV=production
     ```

2. **Frontend on Netlify**:
   - Drag & drop `frontend/` folder to [Netlify](https://netlify.com)
   - Update API URL in `app.js`

### Option 3: Fly.io (Advanced)
**Total Time: ~10 minutes**

1. Install Fly CLI and login
2. Create `fly.toml` in project root:
```toml
app = "your-app-name"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3001"

[[services]]
  http_checks = []
  internal_port = 3001
  processes = ["app"]
  protocol = "tcp"
  
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"
  
  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80
  
  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
  
  [services.tcp_checks]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```

3. Deploy:
```bash
fly apps create your-app-name
fly postgres create
fly deploy
```

## 🔧 Environment Configuration

### Production Environment Variables
```bash
# Backend (.env.production)
NODE_ENV=production
DATABASE_URL=your-production-database-url
CORS_ORIGIN=https://your-frontend-domain.com
PORT=3001

# Security (Optional)
JWT_SECRET=your-secret-key
RATE_LIMIT_MAX=100
```

### Frontend Configuration
Update `frontend/app.js`:
```javascript
// Replace localhost URL with your deployed API
const API_BASE_URL = 'https://your-api-domain.com';
```

## 📊 Database Hosting Options

### Free Tier Databases

1. **Neon** (Recommended)
   - Free: 0.5GB, 1 database
   - Serverless PostgreSQL
   - Auto-suspend when idle
   - Sign up: [neon.tech](https://neon.tech)

2. **Railway PostgreSQL**
   - Free: $5/month credit
   - Easy integration
   - Auto-backups

3. **Supabase**
   - Free: 500MB, 2 projects
   - Real-time capabilities
   - Dashboard included

4. **PlanetScale** (MySQL)
   - Free: 1 database, 5GB
   - Serverless MySQL
   - Branching workflow

### Production Databases
- **AWS RDS**: Scalable, managed
- **Google Cloud SQL**: Integrated with GCP
- **DigitalOcean Managed Database**: Simple pricing
- **Azure Database**: Microsoft ecosystem

## 🐳 Docker Deployment

### Build and Run Locally
```bash
# Build image
docker build -t me-api-playground .

# Run with environment variables
docker run -p 3001:3001 \
  -e DATABASE_URL="your-db-url" \
  -e NODE_ENV="production" \
  me-api-playground
```

### Docker Compose (Development)
```bash
# Start everything (database + app)
docker-compose up

# Access:
# - API: http://localhost:3001
# - Frontend: http://localhost:3000
# - Database: localhost:5432
```

### Docker Compose (Production)
Create `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NODE_ENV=production
      - CORS_ORIGIN=${CORS_ORIGIN}
    restart: unless-stopped
```

## ☁️ Platform-Specific Guides

### Railway Detailed Steps
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Add PostgreSQL
railway add postgresql

# 5. Set environment variables
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://your-frontend.netlify.app

# 6. Deploy
railway deploy
```

### Render Detailed Steps
1. **Create Web Service**:
   - Repository: Your GitHub repo
   - Branch: main
   - Root Directory: backend
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

2. **Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL URL
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: Your frontend URL

3. **Custom Build Script** (if needed):
```bash
#!/bin/bash
npm install
npx prisma generate
npx prisma migrate deploy
```

### Netlify Detailed Steps
1. **Build Settings**:
   - Build command: (leave empty for static)
   - Publish directory: `frontend`

2. **Environment Variables** (for build):
   - `API_BASE_URL`: Your backend URL

3. **Build Hooks** (optional):
   - Auto-deploy when API changes

## 🔒 Security Checklist

### Production Security
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Database credentials rotated
- [ ] HTTPS enforced
- [ ] Rate limiting implemented
- [ ] Input validation enabled
- [ ] Error messages sanitized

### Optional Enhancements
```javascript
// Rate limiting (backend)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Security headers
const helmet = require('helmet');
app.use(helmet());
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_profiles_skills ON profiles USING gin(skills);
CREATE INDEX idx_projects_title ON projects(title);
```

### API Optimization
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Cache headers
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check connection string
   npx prisma db push --preview-feature
   
   # Test connection
   psql "your-database-url"
   ```

2. **CORS Errors**
   ```javascript
   // Update backend app.js
   app.use(cors({
     origin: ['http://localhost:3000', 'https://yourdomain.com'],
     credentials: true
   }));
   ```

3. **Build Failures**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Migration Issues**
   ```bash
   # Reset database (development only)
   npx prisma migrate reset
   
   # Force deploy migrations
   npx prisma migrate deploy --force
   ```

## 📞 Support

If you encounter issues:
1. Check logs on your hosting platform
2. Test locally first
3. Verify environment variables
4. Check database connectivity
5. Review API endpoints with provided test scripts

## 🎯 Go Live Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible  
- [ ] Database connected and seeded
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] Health endpoint responding
- [ ] API endpoints working
- [ ] Frontend can connect to API
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring set up (optional)

**Congratulations! Your Me-API Playground is now live! 🎉**