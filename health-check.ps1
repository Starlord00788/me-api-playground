# Quick Health Check Script for Me-API Playground (PowerShell)

Write-Host "🔍 Me-API Playground Health Check" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project directory structure looks good" -ForegroundColor Green

# Check backend dependencies
if (!(Test-Path "backend/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Check if .env exists
if (!(Test-Path "backend/.env")) {
    Write-Host "⚙️  Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item "backend/.env.example" "backend/.env"
}

Write-Host "✅ Environment file exists" -ForegroundColor Green

# Check if database URL is configured
$envContent = Get-Content "backend/.env" -Raw
if ($envContent -match "username:password@localhost") {
    Write-Host "⚠️  WARNING: Database URL contains placeholder values" -ForegroundColor Yellow
    Write-Host "   Please update DATABASE_URL in backend/.env with real credentials" -ForegroundColor Yellow
    Write-Host "   OR use SQLite for quick testing:" -ForegroundColor Yellow
    Write-Host "   DATABASE_URL=`"file:./dev.db`"" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Quick SQLite setup:" -ForegroundColor Blue
    Write-Host "   1. Change DATABASE_URL to: file:./dev.db" -ForegroundColor White
    Write-Host "   2. In backend/prisma/schema.prisma, change provider to: sqlite" -ForegroundColor White
    Write-Host "   3. Run: npm run db:migrate" -ForegroundColor White
    Write-Host "   4. Run: npm run db:seed" -ForegroundColor White
}

Write-Host ""
Write-Host "🎯 Quick Start Commands:" -ForegroundColor Blue
Write-Host "   Backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "   Frontend: cd frontend; python -m http.server 3000" -ForegroundColor White
Write-Host "   Alternative Frontend: cd frontend; npx serve ." -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed setup instructions, see SETUP.md" -ForegroundColor Blue
Write-Host ""
Write-Host "🔧 Common Issues & Solutions:" -ForegroundColor Magenta
Write-Host "   • Database connection failed: Update DATABASE_URL or use SQLite" -ForegroundColor White
Write-Host "   • Python not found: Install Python or use 'npx serve .' instead" -ForegroundColor White
Write-Host "   • Port already in use: Stop other processes or change PORT in .env" -ForegroundColor White