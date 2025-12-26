# Deployment Checklist - HU Anti-HIV/AIDS Club Platform

## Pre-Deployment Checklist

### Backend Configuration

- [ ] **Environment Variables**
  ```bash
  # Required in .env file
  PORT=5000
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_secure_jwt_secret_key
  JWT_EXPIRE=7d
  NODE_ENV=production
  CLIENT_URL=https://your-frontend-domain.com
  ```

- [ ] **Database Setup**
  - [ ] MongoDB Atlas cluster created
  - [ ] Database user created with appropriate permissions
  - [ ] IP whitelist configured (or 0.0.0.0/0 for all IPs)
  - [ ] Connection string tested

- [ ] **Security**
  - [ ] Strong JWT_SECRET generated (min 32 characters)
  - [ ] CORS configured for production domain
  - [ ] Rate limiting enabled
  - [ ] Helmet.js configured for security headers
  - [ ] Input validation on all endpoints

- [ ] **Admin Account**
  - [ ] Create initial admin user via registration
  - [ ] Manually update user role to 'admin' in database
  - [ ] Test admin login and access

### Frontend Configuration

- [ ] **Environment Variables**
  ```bash
  # .env or .env.production
  VITE_API_URL=https://your-backend-domain.com/api
  ```

- [ ] **Build Configuration**
  - [ ] Update `vite.config.js` if needed
  - [ ] Test production build locally: `npm run build`
  - [ ] Test preview: `npm run preview`

- [ ] **API Integration**
  - [ ] Update `client/src/services/api.js` baseURL for production
  - [ ] Test all API endpoints with production backend

### Code Quality

- [ ] **Backend**
  - [ ] All routes have proper authentication
  - [ ] All admin routes use `restrictTo('admin')`
  - [ ] Error handling middleware in place
  - [ ] Validation middleware on all inputs
  - [ ] No console.logs in production code

- [ ] **Frontend**
  - [ ] All admin routes protected by AdminRoute
  - [ ] All member routes protected by ProtectedRoute
  - [ ] Error boundaries implemented
  - [ ] Loading states on all async operations
  - [ ] No hardcoded API URLs

## Deployment Steps

### Backend Deployment (Render/Heroku/Railway)

#### Option 1: Render.com

1. **Create New Web Service**
   - Connect GitHub repository
   - Select `server` directory as root
   - Build Command: `npm install`
   - Start Command: `node server.js`

2. **Environment Variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`

3. **Database**
   - Use MongoDB Atlas connection string
   - Ensure IP whitelist allows Render IPs

#### Option 2: Railway.app

1. **Create New Project**
   - Connect GitHub repository
   - Railway auto-detects Node.js

2. **Configure**
   - Set root directory to `server`
   - Add environment variables
   - Deploy

#### Option 3: Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   ```

3. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

### Frontend Deployment (Vercel/Netlify)

#### Option 1: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel --prod
   ```

3. **Configure**
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable: `VITE_API_URL`

#### Option 2: Netlify

1. **Create New Site**
   - Connect GitHub repository
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`

2. **Environment Variables**
   - Add `VITE_API_URL` in Netlify dashboard

3. **Configure Redirects**
   - Create `client/public/_redirects`:
   ```
   /*    /index.html   200
   ```

## Post-Deployment Verification

### Backend Tests

- [ ] **Health Check**
  ```bash
  curl https://your-backend.com/api/health
  ```

- [ ] **Authentication**
  - [ ] Register new user works
  - [ ] Login returns JWT token
  - [ ] Protected routes require authentication

- [ ] **Admin Endpoints**
  - [ ] `/api/admin/dashboard/stats` returns data
  - [ ] `/api/admin/users` requires admin role
  - [ ] `/api/admin/settings` works correctly

### Frontend Tests

- [ ] **Public Pages**
  - [ ] Home page loads
  - [ ] About page displays president info
  - [ ] Vision page accessible
  - [ ] Awareness page loads
  - [ ] Anonymous questions form works

- [ ] **Authentication**
  - [ ] Registration creates account
  - [ ] Login redirects to member dashboard
  - [ ] Logout clears session

- [ ] **Member Features**
  - [ ] Dashboard loads
  - [ ] Events page shows events
  - [ ] Stories page accessible
  - [ ] Gallery displays images
  - [ ] Resources page works
  - [ ] Profile page editable

- [ ] **Admin Features**
  - [ ] Admin dashboard shows stats
  - [ ] User management works
  - [ ] Content approval functional
  - [ ] System settings save correctly
  - [ ] Reports generate and export

### Performance Tests

- [ ] **Load Time**
  - [ ] Home page loads < 3 seconds
  - [ ] Dashboard loads < 2 seconds
  - [ ] Images optimized

- [ ] **API Response**
  - [ ] Average response time < 500ms
  - [ ] No timeout errors

### Security Tests

- [ ] **Authentication**
  - [ ] Cannot access admin routes without admin role
  - [ ] Cannot access member routes without login
  - [ ] JWT expires correctly
  - [ ] Invalid tokens rejected

- [ ] **Authorization**
  - [ ] Members cannot access admin endpoints
  - [ ] Public cannot access protected content
  - [ ] CORS only allows configured domains

## Initial Data Setup

### System Settings

1. **Login as Admin**
2. **Navigate to System Settings**
3. **Configure:**
   - Site name: "HU Anti-HIV/AIDS Club"
   - Site description
   - Contact email
   - Contact phone
   - Social media links
   - Feature toggles
   - Security settings

### President Information

- Already configured in About page:
  - Name: Meraol Abdulkader
  - Title: President
  - Bio and contact info

### Sample Content

- [ ] Create 2-3 sample events
- [ ] Upload 5-10 gallery images
- [ ] Create 2-3 sample stories
- [ ] Upload 3-5 resources
- [ ] Answer 2-3 anonymous questions

## Monitoring & Maintenance

### Setup Monitoring

- [ ] **Error Tracking**
  - [ ] Sentry or similar service configured
  - [ ] Error notifications enabled

- [ ] **Uptime Monitoring**
  - [ ] UptimeRobot or similar configured
  - [ ] Alert emails set up

- [ ] **Analytics**
  - [ ] Google Analytics configured (if enabled in settings)
  - [ ] Track key user actions

### Regular Maintenance

- [ ] **Weekly**
  - [ ] Check error logs
  - [ ] Review anonymous questions
  - [ ] Approve pending content

- [ ] **Monthly**
  - [ ] Review user accounts
  - [ ] Check system performance
  - [ ] Update dependencies
  - [ ] Backup database

- [ ] **Quarterly**
  - [ ] Security audit
  - [ ] Performance optimization
  - [ ] User feedback review

## Backup Strategy

### Database Backups

- [ ] **MongoDB Atlas**
  - [ ] Enable automated backups
  - [ ] Set retention period (7-30 days)
  - [ ] Test restore process

- [ ] **Manual Backups**
  ```bash
  mongodump --uri="your_connection_string" --out=./backup
  ```

### Code Backups

- [ ] GitHub repository up to date
- [ ] Tagged releases for versions
- [ ] Documentation updated

## Rollback Plan

### If Deployment Fails

1. **Backend Issues**
   - Revert to previous deployment
   - Check environment variables
   - Review error logs
   - Test database connection

2. **Frontend Issues**
   - Revert to previous build
   - Check API URL configuration
   - Clear browser cache
   - Test in incognito mode

3. **Database Issues**
   - Restore from backup
   - Check connection string
   - Verify IP whitelist
   - Test with MongoDB Compass

## Support & Documentation

### User Documentation

- [ ] Create user guide for members
- [ ] Create admin manual
- [ ] Document common issues
- [ ] Create FAQ page

### Technical Documentation

- [ ] API documentation
- [ ] Database schema
- [ ] Deployment guide
- [ ] Troubleshooting guide

## Contact Information

### Technical Support
- Developer: [Your Name]
- Email: [Your Email]
- Phone: [Your Phone]

### Platform Admin
- President: Meraol Abdulkader
- Email: [Club Email]
- Phone: [Club Phone]

## Success Criteria

✅ **Deployment is successful when:**
- All public pages accessible
- User registration and login work
- Member features functional
- Admin panel fully operational
- No console errors
- Mobile responsive
- Performance acceptable
- Security measures in place
- Monitoring active
- Backups configured

---

## Quick Reference Commands

### Backend
```bash
# Install dependencies
npm install

# Run development
npm run dev

# Run production
npm start

# Check logs
npm run logs
```

### Frontend
```bash
# Install dependencies
npm install

# Run development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database
```bash
# Connect to MongoDB
mongosh "your_connection_string"

# Create admin user (in MongoDB shell)
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { roles: ["admin"] } }
)

# Backup database
mongodump --uri="your_connection_string"

# Restore database
mongorestore --uri="your_connection_string" ./backup
```

---

**Last Updated:** December 22, 2025
**Version:** 1.0.0
