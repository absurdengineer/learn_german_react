#!/bin/bash

# DeutschMeister GitHub Pages Deployment Script

echo "🚀 Starting DeutschMeister deployment to GitHub Pages..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Check if gh-pages package is installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "❌ Error: gh-pages package not found. Installing..."
    npm install gh-pages --save-dev
fi

# Build the project
echo "📦 Building the project..."
NODE_ENV=production npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to GitHub Pages
echo "📤 Deploying to GitHub Pages..."
npx gh-pages -d dist

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app will be available at: https://$(git remote get-url origin | sed 's/.*github.com[\/:]//g' | sed 's/\.git$//g' | sed 's/\//.github.io\//g')"
    echo "⏳ Note: It may take a few minutes for the changes to be visible."
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
