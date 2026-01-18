@echo off
echo Committing PostgreSQL migration fixes...
cd /d "C:\Users\palas\MeAPI"
git add -A
git commit -m "CRITICAL: Fix PostgreSQL migrations for production

- Update migration_lock.toml: sqlite -> postgresql  
- Convert migration.sql to PostgreSQL syntax
- Change DATETIME to TIMESTAMP(3)
- Use proper PostgreSQL arrays (TEXT[]) and JSON (JSONB)
- Add proper PRIMARY KEY constraints
- Fixes P3019 migration provider mismatch error"
git push origin main --force
echo.
echo ✅ Migration fixes pushed to GitHub!
pause