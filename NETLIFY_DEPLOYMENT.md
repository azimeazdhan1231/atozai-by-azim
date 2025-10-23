# Deploying to Netlify

This guide will help you deploy the AtoZAI directory to Netlify.

## Prerequisites
- A Netlify account (free tier works fine)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended)

1. **Connect Repository**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select this repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Functions directory: `dist/netlify/functions`
   
   These are already configured in `netlify.toml`, so Netlify will detect them automatically.

3. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your site will be live at `https://your-site-name.netlify.app`

**IMPORTANT:** Do NOT use drag-and-drop deployment. You MUST deploy via Git connection so that:
- The build command runs and compiles the Netlify Functions
- The data files are copied to the correct location
- All dependencies are properly installed

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Configuration Files

The following files are already configured for Netlify deployment:

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist/public"
  functions = "netlify/functions"
```

This file tells Netlify:
- How to build your app (`npm run build`)
- Where the static files are (`dist/public`)
- Where the serverless functions are (`netlify/functions`)
- How to redirect API calls to serverless functions

### Serverless Functions

The API endpoints are implemented as Netlify serverless functions in `netlify/functions/tools.ts`. This function handles:
- `GET /api/tools` - List all tools with filtering and pagination
- `GET /api/categories` - Get all categories
- `GET /api/tools/:slug` - Get a specific tool by slug

## Verifying Deployment

After deployment, verify that:

1. **Homepage loads** - Visit your Netlify URL
2. **Tools display** - The tool cards should show with correct names (not "Website")
3. **Pagination works** - Click through pages to ensure pagination is working
4. **Filtering works** - Try the search and filter features
5. **Tool details** - Click on a tool to view its detail page

## Troubleshooting

### "No tools found" error

If you see "No tools found" after deployment:

1. Check the Netlify function logs:
   - Go to your site dashboard on Netlify
   - Click "Functions" in the top menu
   - Click on the `tools` function
   - Check the logs for errors

2. Verify the build completed successfully:
   - Check the deploy log for any errors
   - Ensure `dist/public` was created
   - Ensure the function was deployed

### Build failures

If the build fails:

1. Check Node.js version (should be 20.x - configured in netlify.toml)
2. Clear build cache: Site settings → Build & deploy → Clear cache and retry deploy
3. Check the build log for specific error messages

## Custom Domain (Optional)

To use a custom domain:

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

## Environment Variables

This app currently doesn't require any environment variables. If you add features that need API keys or secrets:

1. Go to Site settings → Environment variables
2. Add your variables
3. Redeploy the site

## Performance

The deployed site should be very fast because:
- Static frontend is served from Netlify's global CDN
- Serverless functions run on-demand
- All 2,800+ tools data is efficiently paginated

Expected performance:
- Homepage load: < 1 second
- Tool search/filter: < 300ms
- Page navigation: Instant (client-side routing)

## Cost

With the current setup, this site should stay within Netlify's free tier limits:
- 100GB bandwidth/month
- 125,000 serverless function requests/month
- Unlimited static hosting

This is more than enough for thousands of monthly visitors.
