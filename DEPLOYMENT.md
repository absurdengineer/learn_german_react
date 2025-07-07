# GitHub Pages Deployment Guide for DeutschMeister

## Prerequisites

1. **GitHub Repository**: Make sure your code is pushed to a GitHub repository
2. **Repository Settings**: The repository should be public (or you need GitHub Pro for private repo pages)

## Deployment Methods

### Method 1: Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys your app when you push to the main branch.

**Steps:**
1. Push your code to the `main` branch of your GitHub repository
2. GitHub Actions will automatically build and deploy your app
3. Your app will be available at: `https://absurdengineer.github.io/learn_german_react/`

**Enable GitHub Pages:**
1. Go to your repository settings on GitHub
2. Scroll down to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Choose `gh-pages` branch and `/ (root)` folder
5. Save the settings

### Method 2: Manual Deployment

If you prefer to deploy manually or need to deploy immediately:

```bash
# Install dependencies (if not already done)
npm install

# Build and deploy manually
npm run deploy:manual
```

This will:
1. Build your app with production settings
2. Deploy to the `gh-pages` branch
3. Make it available on GitHub Pages

## Configuration Details

### Vite Configuration
- **Base URL**: Set to `/learn_german_react/` for GitHub Pages
- **PWA**: Configured for offline functionality
- **Build Output**: `dist` folder

### GitHub Actions
- **Trigger**: Runs on push to `main` branch
- **Node Version**: 18.x
- **Auto-Deploy**: Uses `peaceiris/actions-gh-pages@v3`
- **Build Process**: The `dist` folder is built during CI/CD (not committed to git)

### Important Notes
- The `dist` folder is in `.gitignore` - this is correct and intentional
- GitHub Actions builds the project fresh on each deployment
- No need to commit built files to your repository

## PWA Features

Your app will work as a Progressive Web App with:
- ✅ Offline functionality
- ✅ App-like experience
- ✅ Service worker caching
- ✅ Installable on mobile devices

## Troubleshooting

### Common Issues:

1. **404 Error**: Make sure the base URL matches your repository name
2. **Assets Not Loading**: Check that all relative paths are correct
3. **PWA Not Working**: Ensure HTTPS is enabled (GitHub Pages provides this)
4. **Deployment Fails**: The `dist` folder should NOT be committed to git - it's built during CI/CD

### Debug Steps:

1. **Check Build**: Run `npm run build` locally to ensure no build errors
2. **Check Preview**: Run `npm run preview` to test the built app locally
3. **Check GitHub Actions**: Visit the "Actions" tab in your repository to see deployment status
4. **Check Repository Settings**: Ensure GitHub Pages is set to deploy from `gh-pages` branch

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add your domain to the `cname` field in `.github/workflows/deploy.yml`
2. Configure DNS settings with your domain provider
3. Add a CNAME record pointing to `absurdengineer.github.io`

## Repository Structure

```
learn_german_react/
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── src/                          # Source code
├── public/                       # Static assets
├── dist/                         # Built app (auto-generated)
├── package.json                  # NPM scripts including deploy
└── vite.config.ts               # Vite configuration
```

## Live URL

After deployment, your DeutschMeister app will be available at:
`https://absurdengineer.github.io/learn_german_react/`
