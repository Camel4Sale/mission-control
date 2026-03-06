#!/bin/bash
# Automated Deployment Script for All Projects

set -e

echo "🚀 Starting Deployment..."

# Pathium Agency Website
echo "📦 Deploying Pathium..."
cd pathium-agency-website
vercel --prod --yes
cd ..

# Elysium Property Dashboard
echo "🏠 Deploying Elysium..."
cd elysium-property-dashboard
npm run prisma:generate
npm run prisma:push
npm run build
vercel --prod --yes
cd ..

# Celaris Landing (when ready)
echo "☀️ Deploying Celaris..."
cd celaris-landing
npm run build
vercel --prod --yes
cd ..

echo "✅ All deployments complete!"
