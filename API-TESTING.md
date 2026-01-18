# 🧪 API Testing Guide

This file contains sample requests to test all endpoints of the Me-API Playground.

## Base Configuration
```bash
export API_BASE="http://localhost:3001"
# Or your deployed URL: export API_BASE="https://your-api-domain.com"
```

## 1. Health Check
```bash
curl ${API_BASE}/health
```
Expected Response:
```json
{"status": "ok"}
```

## 2. Profile Management

### Get All Profiles
```bash
curl -X GET ${API_BASE}/api/profile
```

### Get Profile by ID
```bash
# Replace {id} with actual profile ID
curl -X GET ${API_BASE}/api/profile/{id}
```

### Create New Profile
```bash
curl -X POST ${API_BASE}/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Wilson",
    "email": "sarah.wilson@example.com",
    "education": "M.S. Data Science, Stanford University",
    "skills": ["Python", "Machine Learning", "TensorFlow", "SQL", "Docker"],
    "projects": [
      {
        "title": "ML Recommendation Engine",
        "description": "Built a collaborative filtering recommendation system for e-commerce platform using Python and TensorFlow",
        "links": ["https://github.com/sarah/ml-recommender"]
      }
    ],
    "work": [
      {
        "company": "DataTech Solutions",
        "role": "Data Scientist",
        "duration": "2023 - Present",
        "description": "Developed machine learning models for customer segmentation and predictive analytics"
      }
    ],
    "links": {
      "github": "https://github.com/sarahwilson",
      "linkedin": "https://linkedin.com/in/sarah-wilson-ds",
      "portfolio": "https://sarahwilson.dev"
    }
  }'
```

### Update Profile
```bash
# Replace {id} with actual profile ID
curl -X PUT ${API_BASE}/api/profile/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Wilson (Updated)",
    "email": "sarah.wilson@example.com",
    "education": "M.S. Data Science, Stanford University (2023)",
    "skills": ["Python", "Machine Learning", "TensorFlow", "SQL", "Docker", "Kubernetes"]
  }'
```

### Delete Profile
```bash
# Replace {id} with actual profile ID
curl -X DELETE ${API_BASE}/api/profile/{id}
```

## 3. Query Endpoints

### Search Projects by Skill
```bash
# Find all projects that use JavaScript
curl -X GET "${API_BASE}/api/projects?skill=JavaScript"

# Find all projects that use Python
curl -X GET "${API_BASE}/api/projects?skill=Python"

# Find all projects that use React
curl -X GET "${API_BASE}/api/projects?skill=React"
```

### Get Top Skills
```bash
curl -X GET ${API_BASE}/api/skills/top
```

### General Search
```bash
# Search for "react" across projects, skills, and work descriptions
curl -X GET "${API_BASE}/api/search?q=react"

# Search for "machine learning"
curl -X GET "${API_BASE}/api/search?q=machine%20learning"

# Search for "api"
curl -X GET "${API_BASE}/api/search?q=api"

# Search for "python"
curl -X GET "${API_BASE}/api/search?q=python"
```

## 4. Error Testing

### Invalid Requests
```bash
# Missing required fields
curl -X POST ${API_BASE}/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete User"
  }'

# Invalid profile ID
curl -X GET ${API_BASE}/api/profile/invalid-id

# Missing search parameter
curl -X GET "${API_BASE}/api/projects"
```

## 5. Batch Testing Script

Save this as `test-api.sh` for comprehensive testing:

```bash
#!/bin/bash

API_BASE="http://localhost:3001"

echo "🚀 Testing Me-API Playground"
echo "=============================="

echo "1. Health Check"
curl -s ${API_BASE}/health | jq .
echo -e "\n"

echo "2. Get All Profiles"
curl -s ${API_BASE}/api/profile | jq '. | length'
echo -e "\n"

echo "3. Search by Skill: JavaScript"
curl -s "${API_BASE}/api/projects?skill=JavaScript" | jq '. | length'
echo -e "\n"

echo "4. Get Top Skills"
curl -s ${API_BASE}/api/skills/top | jq '.[0:3]'
echo -e "\n"

echo "5. General Search: react"
curl -s "${API_BASE}/api/search?q=react" | jq '. | length'
echo -e "\n"

echo "✅ API Testing Complete"
```

Make executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

## 6. Frontend Testing

Open your browser to:
- **Frontend App**: http://localhost:3000
- **API Health**: http://localhost:3001/health
- **Direct API**: http://localhost:3001/api/profile

### Frontend Test Scenarios:
1. **Load Profile**: Click "Load Profile" button
2. **Search by Skill**: Try "JavaScript", "Python", "React"
3. **General Search**: Search for "api", "web", "database"
4. **Top Skills**: Click "View Top Skills"
5. **API Status**: Should show green checkmark

## 7. Performance Testing

### Simple Load Test
```bash
# Install Apache Bench (ab) if not available
# Ubuntu/Debian: sudo apt-get install apache2-utils
# macOS: brew install httpie

# Test 100 requests to health endpoint
ab -n 100 -c 10 ${API_BASE}/health

# Test profile endpoint
ab -n 50 -c 5 ${API_BASE}/api/profile
```

## 8. Expected Response Times
- Health Check: < 10ms
- Get Profile: < 100ms
- Search Queries: < 200ms
- Create Profile: < 300ms

All endpoints should return within 300ms under normal conditions.