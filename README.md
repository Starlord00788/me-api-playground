# 🚀 Me-API Playground

A lightweight, self-hosted backend system that stores a candidate's professional profile in a database and exposes it via a clean REST API, with a minimal frontend for easy interaction.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Frontend Features](#frontend-features)
- [Deployment](#deployment)
- [Sample Requests](#sample-requests)
- [Known Limitations](#known-limitations)
- [Resume Link](#resume-link)

## 🎯 Overview

The Me-API Playground demonstrates backend fundamentals, API design, and database modeling through a practical candidate profile management system. It's designed to showcase professional capabilities in a clean, deployable format.

**Live Demo:** [Demo coming soon - set up your own in 5 minutes!]  
**API Base URL:** [Your deployed API URL]

> 💡 **Quick Start**: Use the provided Docker Compose file to get everything running locally in under 2 minutes!

## 🏗️ Architecture

```
   Frontend (Port 3000)     Backend API (Port 3001)     Database
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────┐
│                     │   │                     │   │                 │
│  HTML/CSS/JS       │───│  Node.js + Express  │───│   PostgreSQL    │
│  • Profile Display  │   │  • REST API         │   │  • Profiles     │
│  • Search Interface │   │  • CRUD Operations  │   │  • Projects     │
│  • Real-time Status│   │  • Query Endpoints  │   │  • Work History │
│                     │   │  • Error Handling   │   │                 │
└─────────────────────┘   └─────────────────────┘   └─────────────────┘
         ↓                          ↓                        ↓
   Static Hosting           API Hosting              Database Hosting
  (Netlify/Vercel)       (Railway/Render)          (Neon/Railway)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    Frontend     │────│   Backend API   │────│   PostgreSQL    │
│  (HTML/CSS/JS)  │    │  (Node.js +     │    │   Database      │
│                 │    │   Express)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
   Static Hosting          API Hosting               DB Hosting
  (Netlify/Vercel)      (Render/Railway)         (Railway/Neon)
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (≥18)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Built-in validation
- **CORS:** Configurable origins

### Frontend
- **Languages:** HTML5, CSS3, Vanilla JavaScript
- **Styling:** Custom CSS with responsive design
- **Features:** REST API consumption, search functionality

### DevOps
- **Environment:** Docker-ready
- **Deployment:** Render, Railway, Fly.io compatible
- **Database Hosting:** Railway, Neon, or any PostgreSQL provider

## ✨ Features

### Backend Features
- ✅ Complete CRUD operations for profiles
- ✅ Advanced search and filtering
- ✅ Skill-based project discovery
- ✅ Top skills analytics
- ✅ Health monitoring endpoint
- ✅ Comprehensive error handling
- ✅ Automatic database seeding
- ✅ CORS configuration

### Frontend Features
- ✅ Profile display and management
- ✅ Real-time search functionality
- ✅ Skills-based project filtering
- ✅ Responsive mobile design
- ✅ API health monitoring
- ✅ Clean, modern UI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd me-api-playground

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (optional)
cd ../frontend
npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cd backend
cp .env.example .env

# Edit .env with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/meapi?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start Development

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
python -m http.server 3000
# OR serve frontend files with your preferred method
```

### 5. Verify Setup

- Backend API: http://localhost:3001/health
- Frontend: http://localhost:3000
- Database Studio: `npm run db:studio` (in backend directory)

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
No authentication required for this playground version.

### Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{ "status": "ok" }
```

#### Profile Management

##### Get All Profiles
```http
GET /api/profile
```

##### Get Profile by ID
```http
GET /api/profile/:id
```

##### Create Profile
```http
POST /api/profile
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "education": "B.S. Computer Science",
  "skills": ["JavaScript", "Node.js", "React"],
  "projects": [
    {
      "title": "E-commerce App",
      "description": "Full-stack shopping application",
      "links": ["https://github.com/john/ecommerce"]
    }
  ],
  "work": [
    {
      "company": "Tech Corp",
      "role": "Developer",
      "duration": "2022-2024",
      "description": "Built web applications"
    }
  ],
  "links": {
    "github": "https://github.com/john",
    "linkedin": "https://linkedin.com/in/john",
    "portfolio": "https://johndoe.dev"
  }
}
```

##### Update Profile
```http
PUT /api/profile/:id
Content-Type: application/json

{
  "name": "John Doe Updated",
  // ... other fields
}
```

##### Delete Profile
```http
DELETE /api/profile/:id
```

#### Query Endpoints

##### Search Projects by Skill
```http
GET /api/projects?skill=javascript
```

##### Get Top Skills
```http
GET /api/skills/top
```

##### General Search
```http
GET /api/search?q=react
```

### Error Responses
All errors return JSON in this format:
```json
{
  "error": "Human readable error message"
}
```

**Status Codes:**
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error

## 🗄️ Database Schema

### Profile Table
| Column    | Type     | Constraints |
|-----------|----------|-------------|
| id        | UUID     | Primary Key |
| name      | String   | Required    |
| email     | String   | Unique, Required |
| education | String   | Optional    |
| skills    | String[] | Array       |
| links     | JSON     | Optional    |
| createdAt | DateTime | Auto        |
| updatedAt | DateTime | Auto        |

### Project Table
| Column      | Type     | Constraints |
|-------------|----------|-------------|
| id          | UUID     | Primary Key |
| title       | String   | Required, Indexed |
| description | String   | Required    |
| links       | String[] | Array       |
| profileId   | UUID     | Foreign Key |

### Work Table
| Column      | Type     | Constraints |
|-------------|----------|-------------|
| id          | UUID     | Primary Key |
| company     | String   | Required    |
| role        | String   | Required    |
| duration    | String   | Required    |
| description | String   | Required    |
| profileId   | UUID     | Foreign Key |

## 🎨 Frontend Features

### Pages & Components
- **Main Dashboard:** Profile overview and search interface
- **Search Results:** Dynamic results display
- **API Status:** Real-time health monitoring

### Search Functionality
1. **Skill-based Search:** Find projects by specific skills
2. **General Search:** Search across projects, skills, and work descriptions
3. **Top Skills:** View most popular skills by frequency

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Modern CSS Grid and Flexbox

## 🌐 Deployment

### Backend Deployment (Render/Railway)

#### Render
1. Connect your GitHub repository
2. Set environment variables:
   ```
   DATABASE_URL=your-production-db-url
   NODE_ENV=production
   CORS_ORIGIN=your-frontend-url
   ```
3. Build command: `npm install`
4. Start command: `npm start`

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add postgresql
railway deploy
```

### Frontend Deployment (Netlify/Vercel)

#### Netlify
```bash
# Build and deploy
npm run build  # if using build process
netlify deploy --dir=frontend --prod
```

#### Vercel
```bash
# Deploy static files
vercel --prod frontend/
```

### Environment Variables for Production
```bash
# Backend
DATABASE_URL="postgresql://prod-user:password@host:5432/database"
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend-domain.com"
PORT="3001"

# Frontend (update app.js)
API_BASE_URL="https://your-api-domain.com"
```

## 🧪 Sample Requests

### Using cURL

```bash
# Health check
curl https://your-api-url/health

# Get all profiles
curl https://your-api-url/api/profile

# Search projects by skill
curl "https://your-api-url/api/projects?skill=JavaScript"

# General search
curl "https://your-api-url/api/search?q=react"

# Get top skills
curl https://your-api-url/api/skills/top

# Create profile
curl -X POST https://your-api-url/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Developer",
    "email": "jane@example.com",
    "skills": ["Python", "Django", "PostgreSQL"],
    "education": "M.S. Software Engineering"
  }'
```

### Using JavaScript (Frontend)

```javascript
// Get profile
const profile = await fetch('https://your-api-url/api/profile')
  .then(res => res.json());

// Search projects
const projects = await fetch('https://your-api-url/api/projects?skill=Python')
  .then(res => res.json());
```

## ⚠️ Known Limitations

### Current Limitations
- **Single User:** Designed for one candidate profile
- **No Authentication:** Open API (suitable for demos)
- **Basic Validation:** Minimal input validation
- **No Caching:** Direct database queries
- **Limited Testing:** No automated test suite

### Security Considerations
- Input validation could be enhanced
- Rate limiting not implemented
- SQL injection protection via Prisma ORM
- CORS configured for specific origins

### Performance Notes
- Suitable for small to medium datasets
- No pagination implemented
- Database indexes on key search fields
- Response times typically < 300ms

## 🔗 Resume Link

**[View My Complete Resume]([https://your-resume-link.com](https://drive.google.com/file/d/1BKKAVC1Q5UpbSLYiKSKRbjSoBTswLvLy/view?usp=sharing))**

## 📞 Contact & Links

- **GitHub:** https://github.com/Starlord00788
- **LinkedIn:** https://www.linkedin.com/in/palash-singhal-299134293/
- **Email:** 231220043@nitdelhi.ac.in

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Me-API Playground Challenge**

*This project demonstrates full-stack development capabilities, API design principles, and modern deployment practices.*
