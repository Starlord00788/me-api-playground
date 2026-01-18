Set-Location "C:\Users\palas\MeAPI"
git add -A
git commit -m "CRITICAL FIX: PostgreSQL schema + frontend backend URL"
git push origin main --force
Write-Host "Committed and pushed to GitHub!" -ForegroundColor Green