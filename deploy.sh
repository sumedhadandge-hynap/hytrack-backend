#!/bin/bash

echo "🚀 Deploying Hytrack Backend..."

cd ~/Sumedha_Dandge/hytrack-backend || exit

echo "📥 Pulling latest code..."
git pull origin test-beta-deploy

echo "📦 Installing dependencies..."
npm install

echo "🏗 Building NestJS app..."
npm run build

echo "🗄 Running migrations..."
npm run db:migrate

echo "🔄 Restarting PM2..."
pm2 restart hytrack-beta --update-env || pm2 start dist/src/main.js --name hytrack-beta

echo "💾 Saving PM2..."
pm2 save

echo "✅ Backend deployment completed!"
