# create-project-structure.ps1
# Ana script - Tüm diğer scriptleri çağırır

# Ana proje klasörü oluştur
$projectName = "appointment-management-saas"
$rootFolder = "$PSScriptRoot\$projectName"

Write-Host "SaaS Randevu Yönetim Sistemi projesi oluşturuluyor: $rootFolder" -ForegroundColor Green

# Eğer klasör zaten varsa, uyarı ver ve devam et mi diye sor
if (Test-Path $rootFolder) {
    $continue = Read-Host "Bu klasör zaten mevcut. İçeriği silinecek. Devam etmek istiyor musunuz? (E/H)"
    if ($continue -ne "E") {
        Write-Host "İşlem iptal edildi." -ForegroundColor Red
        exit
    }
    Remove-Item -Path $rootFolder -Recurse -Force
}

# Ana klasörü oluştur
New-Item -Path $rootFolder -ItemType Directory | Out-Null

# Kök dizin dosyaları oluştur
Set-Content -Path "$rootFolder\README.md" -Value "# SaaS Randevu Yönetim Sistemi`n`nBerber, kuaför, diş hekimi muayenehanesi, pet klinik, saç ekim merkezleri ve benzeri hizmet sektöründeki işletmeler için web tabanlı SaaS yapısında bir randevu ve işletme yönetim sistemi."
Set-Content -Path "$rootFolder\package.json" -Value '{
  "name": "appointment-management-saas",
  "version": "1.0.0",
  "description": "Hizmet sektörü için SaaS randevu yönetim sistemi",
  "main": "index.js",
  "scripts": {
    "start": "docker-compose up",
    "dev": "docker-compose up -d",
    "stop": "docker-compose down"
  },
  "author": "",
  "license": "ISC"
}'
Set-Content -Path "$rootFolder\docker-compose.yml" -Value 'version: "3.8"
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../infra/docker/frontend/Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    depends_on:
      - backend
  
  backend:
    build:
      context: ./backend
      dockerfile: ../infra/docker/backend/Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
      
volumes:
  mongo-data:'
Set-Content -Path "$rootFolder\.gitignore" -Value 'node_modules/
.env
*.log
.DS_Store
dist/
build/
coverage/
.idea/
.vscode/
*.iml'
Set-Content -Path "$rootFolder\.env.example" -Value '# Frontend Environment Variables
VITE_API_URL=http://localhost:8000/api/v1

# Backend Environment Variables
PORT=8000
MONGODB_URI=mongodb://mongo:27017/appointment-saas
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
NODE_ENV=development

# Email Configuration
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# SMS Configuration
SMS_API_KEY=
SMS_SENDER=

# Payment Gateway
PAYMENT_API_KEY='

# Diğer scriptleri çağır
Write-Host "Dizin yapısı oluşturuluyor..." -ForegroundColor Yellow
& "$PSScriptRoot\create-directories.ps1" -rootFolder $rootFolder

Write-Host "Frontend dosyaları oluşturuluyor..." -ForegroundColor Yellow
& "$PSScriptRoot\create-frontend-files.ps1" -rootFolder $rootFolder

Write-Host "Backend dosyaları oluşturuluyor..." -ForegroundColor Yellow
& "$PSScriptRoot\create-backend-files.ps1" -rootFolder $rootFolder

# Script tamamlandı mesajı
Write-Host "`nSaaS Randevu Yönetim Sistemi proje yapısı başarıyla oluşturuldu!" -ForegroundColor Green
Write-Host "Proje klasörü: $rootFolder" -ForegroundColor Green

# Projeyi başlatmak için yönergeler göster
Write-Host "`nProjeyi başlatmak için:" -ForegroundColor Yellow
Write-Host "1. Proje dizinine gidin: cd $projectName" -ForegroundColor Yellow
Write-Host "2. Docker ortamını başlatın: docker-compose up" -ForegroundColor Yellow
Write-Host "3. Tarayıcınızda http://localhost:3000 adresine gidin" -ForegroundColor Yellow
Write-Host "`nİyi çalışmalar!" -ForegroundColor Yellow