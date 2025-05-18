# create-directories.ps1
# Tüm dizin yapısını oluşturur

param (
    [string]$rootFolder
)

# Dizin yapısını oluştur
$directories = @(
    # Frontend
    "frontend",
    "frontend\public",
    "frontend\public\assets",
    "frontend\src",
    "frontend\src\assets",
    "frontend\src\components",
    "frontend\src\components\common",
    "frontend\src\components\layout",
    "frontend\src\components\modules",
    "frontend\src\components\modules\appointments",
    "frontend\src\components\modules\customers",
    "frontend\src\components\modules\services",
    "frontend\src\components\modules\staff",
    "frontend\src\components\modules\payments",
    "frontend\src\config",
    "frontend\src\context",
    "frontend\src\hooks",
    "frontend\src\pages",
    "frontend\src\pages\auth",
    "frontend\src\pages\dashboard",
    "frontend\src\pages\appointments",
    "frontend\src\pages\customers",
    "frontend\src\pages\services",
    "frontend\src\pages\staff",
    "frontend\src\pages\reports",
    "frontend\src\pages\settings",
    "frontend\src\services",
    "frontend\src\store",
    "frontend\src\store\slices",
    "frontend\src\store\middleware",
    "frontend\src\styles",
    "frontend\src\utils",
    
    # Backend
    "backend",
    "backend\src",
    "backend\src\api",
    "backend\src\api\v1",
    "backend\src\config",
    "backend\src\controllers",
    "backend\src\middlewares",
    "backend\src\models",
    "backend\src\services",
    "backend\src\utils",
    "backend\src\jobs",
    "backend\src\validators",
    "backend\src\errors",
    "backend\database",
    "backend\database\migrations",
    "backend\database\seeds",
    "backend\tests",
    "backend\tests\unit",
    "backend\tests\unit\services",
    "backend\tests\unit\controllers",
    "backend\tests\unit\models",
    "backend\tests\integration",
    "backend\tests\integration\api",
    "backend\tests\integration\services",
    "backend\tests\e2e",
    
    # Mobile
    "mobile",
    "mobile\business-app",
    "mobile\business-app\src",
    "mobile\business-app\src\screens",
    "mobile\business-app\src\components",
    "mobile\business-app\src\navigation",
    "mobile\business-app\src\services",
    "mobile\business-app\src\utils",
    "mobile\customer-app",
    "mobile\customer-app\src",
    "mobile\customer-app\src\screens",
    "mobile\customer-app\src\components",
    "mobile\customer-app\src\navigation",
    "mobile\customer-app\src\services",
    "mobile\customer-app\src\utils",
    
    # Docs
    "docs",
    "docs\api",
    "docs\architecture",
    "docs\guides",
    "docs\diagrams",
    
    # Infra
    "infra",
    "infra\docker",
    "infra\docker\frontend",
    "infra\docker\backend",
    "infra\docker\nginx",
    "infra\k8s",
    "infra\k8s\frontend",
    "infra\k8s\backend",
    "infra\k8s\database",
    "infra\scripts"
)

foreach ($dir in $directories) {
    $path = "$rootFolder\$dir"
    New-Item -Path $path -ItemType Directory | Out-Null
    Write-Host "Klasör oluşturuldu: $path" -ForegroundColor Cyan
}

# Infra klasörüne temel dosyalar oluştur
Set-Content -Path "$rootFolder\infra\docker\frontend\Dockerfile" -Value 'FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]'

Set-Content -Path "$rootFolder\infra\docker\backend\Dockerfile" -Value 'FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]'

Set-Content -Path "$rootFolder\infra\docker\nginx\Dockerfile" -Value 'FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]'

Set-Content -Path "$rootFolder\infra\docker\nginx\nginx.conf" -Value 'server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}'