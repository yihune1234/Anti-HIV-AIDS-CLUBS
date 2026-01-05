# React Router SPA Deployment Guide

This guide explains how to fix 404 errors when refreshing pages or directly accessing routes in your React SPA built with Vite.

## Problem
When using React Router, refreshing the page or directly accessing a route like `/dashboard` causes a 404 error because the server tries to find that actual file/directory instead of serving the React app.

## Solutions Implemented

### 1. Vite Development Server Configuration ✅
Updated `vite.config.js` to handle client-side routing in development:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true
  }
})
```

### 2. Express Server Configuration ✅
Updated `server.js` to serve static files and handle SPA fallback in production:
```javascript
// Serve static files from the React app in production
if (constants.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    // SPA fallback - redirect all non-API routes to index.html
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) {
            return notFound(req, res);
        }
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}
```

### 3. Apache Server Configuration ✅
Created `.htaccess` file for Apache servers with rewrite rules.

### 4. Netlify Configuration ✅
Verified `_redirects` file exists for Netlify deployment.

## Deployment Instructions

### For Development
```bash
cd client
npm run dev
```
The development server now handles client-side routing correctly.

### For Production

#### Build the App
```bash
cd client
npm run build
```

#### Deploy to Different Platforms

**Apache Server:**
- Upload the `client/dist` folder to your server
- The `.htaccess` file will handle routing automatically

**Nginx Server:**
Add this to your Nginx configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Netlify:**
- Deploy the `client/dist` folder
- The `_redirects` file handles routing automatically

**Vercel:**
- Deploy the `client/dist` folder
- Vercel automatically detects SPA and handles routing

**Heroku:**
- The Express server configuration handles routing automatically

## Testing
After deployment, test these scenarios:
1. Navigate through the app using links ✅
2. Refresh the page on different routes ✅ 
3. Directly access routes like `/dashboard` ✅
4. Use browser back/forward buttons ✅

## Troubleshooting

If you still get 404 errors:

1. **Check server configuration** - Ensure the SPA fallback is properly configured
2. **Verify build output** - Make sure `index.html` exists in the dist folder
3. **Check API routes** - Ensure API routes aren't being caught by the fallback
4. **Clear browser cache** - Sometimes old configurations are cached

## File Structure After Build
```
client/dist/
├── index.html          # Main HTML file
├── .htaccess          # Apache configuration
├── _redirects         # Netlify configuration
├── assets/            # Static assets
│   ├── index-abc123.js
│   └── index-def456.css
└── ...
```

All configurations are now in place for proper SPA routing across different deployment environments.
