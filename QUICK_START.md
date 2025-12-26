# Quick Start Guide - HU Anti-HIV/AIDS Club Platform

Get up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need v16+)
node --version

# Check npm version
npm --version

# Check if MongoDB is running
mongosh --version
```

## 🚀 Fast Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/hu-hiv-aids-club.git
cd hu-hiv-aids-club

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment (1 minute)

**Backend (.env in server folder):**
```bash
cd server
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hiv-aids-club
JWT_SECRET=my_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
EOF
```

**Frontend (.env in client folder):**
```bash
cd client
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
```

### 3. Start Development Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Create Admin Account (1 minute)

1. Open browser: http://localhost:5173
2. Click "Register"
3. Fill in the form:
   - Username: admin
   - Email: admin@example.com
   - Password: Admin123
   - First Name: Admin
   - Last Name: User
   - Department: Administration
   - Year: 1

4. Open MongoDB Compass or shell:
```javascript
// Connect to: mongodb://localhost:27017/hiv-aids-club

// Make user admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { roles: ["admin"] } }
)
```

5. Login with admin credentials
6. Access admin panel: http://localhost:5173/admin

## ✅ Verify Installation

### Test Backend
```bash
# Health check
curl http://localhost:5000/api/health

# Should return: {"success":true,"message":"API is running"}
```

### Test Frontend
1. Open http://localhost:5173
2. You should see the home page
3. Navigate to different pages
4. Try registering a user
5. Login and access member dashboard
6. Login as admin and access admin panel

## 🎯 Quick Feature Test

### As Public User
1. Visit home page
2. Go to "Anonymous Questions"
3. Submit a question
4. Register a new account

### As Member
1. Login with member account
2. View events
3. View gallery
4. View stories
5. View resources
6. Update profile

### As Admin
1. Login with admin account
2. Go to `/admin`
3. Check dashboard stats
4. View users in "Manage Members"
5. Create a test event
6. Upload a gallery image
7. Answer anonymous question
8. Configure system settings

## 🐛 Common Issues & Fixes

### Issue: MongoDB Connection Failed
```bash
# Start MongoDB
# On Mac:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
net start MongoDB
```

### Issue: Port Already in Use
```bash
# Backend (port 5000)
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### Issue: JWT Secret Error
```bash
# Make sure .env file exists in server folder
cd server
ls -la .env

# If missing, create it with the template above
```

### Issue: CORS Error
```bash
# Check CLIENT_URL in server/.env matches frontend URL
# Default should be: http://localhost:5173
```

### Issue: Cannot Login as Admin
```javascript
// Verify admin role in MongoDB
db.users.findOne({ email: "admin@example.com" })

// Should show: roles: ["admin"]
// If not, run:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { roles: ["admin"] } }
)
```

## 📦 Sample Data (Optional)

Want to populate with sample data? Run this in MongoDB:

```javascript
// Connect to database
use hiv-aids-club

// Create sample event
db.events.insertOne({
  title: "HIV Awareness Workshop",
  description: "Learn about HIV prevention and treatment",
  eventType: "workshop",
  startDate: new Date("2025-12-25T09:00:00Z"),
  endDate: new Date("2025-12-25T17:00:00Z"),
  location: {
    venue: "Main Hall, Haramaya University"
  },
  status: "published",
  registrations: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// Create sample story
db.stories.insertOne({
  title: "My Journey with HIV Awareness",
  content: "This is a sample story about HIV awareness...",
  category: "personal_journey",
  status: "published",
  isAnonymous: false,
  tags: ["awareness", "education"],
  views: 0,
  likes: [],
  comments: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// Create sample gallery item
db.galleries.insertOne({
  title: "Awareness Campaign 2025",
  images: [{
    url: "https://via.placeholder.com/800x600",
    caption: "Event photo"
  }],
  albumType: "event",
  status: "published",
  likes: [],
  comments: [],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🔧 Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- **Backend:** Nodemon automatically restarts on file changes
- **Frontend:** Vite HMR updates instantly

### Debug Mode
```bash
# Backend with debug logs
cd server
DEBUG=* npm run dev

# Frontend with React DevTools
# Install React DevTools browser extension
```

### API Testing
```bash
# Install REST client (optional)
npm install -g @postman/newman

# Or use curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123"}'
```

### Database GUI
```bash
# MongoDB Compass (recommended)
# Download from: https://www.mongodb.com/products/compass

# Or use Studio 3T
# Download from: https://studio3t.com/
```

## 📚 Next Steps

1. **Read Documentation**
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
   - [ACCESS_CONTROL_TABLE.md](ACCESS_CONTROL_TABLE.md) - Permissions
   - [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing instructions

2. **Configure System**
   - Login as admin
   - Go to System Settings
   - Update site name, contact info, social media links

3. **Add Content**
   - Create events
   - Upload gallery images
   - Add resources
   - Publish stories

4. **Customize**
   - Update colors in CSS
   - Add your logo
   - Customize about page
   - Update president information

## 🎨 Customization Quick Tips

### Change Primary Color
```css
/* client/src/index.css */
:root {
  --primary-color: #E53935; /* Change this */
}
```

### Update Logo
```javascript
// Replace logo in client/public/
// Update references in components
```

### Change Site Name
```javascript
// Login as admin
// Go to: /admin/settings
// Update "Site Name" field
```

## 🚀 Ready to Deploy?

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for production deployment.

Quick deploy options:
- **Backend:** Render, Railway, or Heroku
- **Frontend:** Vercel or Netlify
- **Database:** MongoDB Atlas (free tier available)

## 💡 Pro Tips

1. **Use MongoDB Atlas** for cloud database (free tier)
2. **Enable auto-save** in your code editor
3. **Use Git branches** for new features
4. **Test in incognito** to avoid cache issues
5. **Keep dependencies updated** regularly

## 🆘 Need Help?

- **Documentation:** Check the docs folder
- **Issues:** Create GitHub issue
- **Email:** support@example.com
- **Community:** Join our Discord/Slack

## ✨ You're All Set!

Your development environment is ready. Start building amazing features! 🎉

---

**Happy Coding! 💻**

**Last Updated:** December 22, 2025
