#!/bin/bash

# Quick commit script for PostgreSQL fixes
cd /c/Users/palas/MeAPI

echo "Adding all changes..."
git add .

echo "Committing PostgreSQL query controller fixes..."
git commit -m "Fix query controller for PostgreSQL arrays

- Remove JSON.parse calls for skills (now TEXT[] arrays)  
- Remove JSON.parse calls for project links (now JSON objects)
- Change skills search from 'contains' to 'has' for PostgreSQL arrays
- Update comments to reflect PostgreSQL usage
- Fixes 500 errors on /api/skills/top endpoint"

echo "Pushing to origin main..."
git push origin main

echo "Done! Render will auto-deploy the fixes."