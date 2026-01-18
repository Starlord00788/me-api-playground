@echo off
cd /d "C:\Users\palas\MeAPI"
git add .
git commit -m "Fix: Switch to PostgreSQL for production deployment

- Updated Prisma schema to use PostgreSQL instead of SQLite
- Modified seed data to use PostgreSQL arrays and JSON
- Updated frontend to handle both PostgreSQL and SQLite formats
- Resolves PrismaClientInitializationError on Render"
git push origin main
echo Done!