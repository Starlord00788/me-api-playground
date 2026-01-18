Write-Host "Starting git commit process..." -ForegroundColor Yellow
Set-Location "C:\Users\palas\MeAPI"
git add .
git status
Write-Host "Committing changes..." -ForegroundColor Yellow  
git commit -m "Fix PostgreSQL migrations - resolves P3019 error"
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host "✅ Done!" -ForegroundColor Green