# Troubleshooting Guide - HU Anti-HIV/AIDS Club Platform

## 🚨 Common Issues and Solutions

### Issue 1: 403 Forbidden on Admin Routes

**Symptoms:**
- Getting 403 errors when accessing `/admin` routes
- Console shows: "Failed to load resource: the server responded with a status of 403"
- Admin dashboard won't load

**Cause:**
The user account doesn't have the admin role assigned.

**Solution:**

#### Option 1: Using the Setup Script (Recommended)

1. Make sure you have registered a user account first
2. Run the setup script:

```bash
cd server
node setup-admin.js your-email@example.com
```

Example:
```bash
node setup-admin.js admin@example.com
```

The script will:
- Find the user by email
- Set their role to admin
- Activate their account
- Display confirmation

#### Option 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database: `mongodb://localhost:27017/hiv-aids-club`
3. Go to the `users` collection
4. Find your user by email
5. Click "Edit Document"
6. Update the `roles` field to: `["admin"]`
7. Make sure `isActive` is `true`
8. Click "Update"

#### Option 3: Using MongoDB Shell

```bash
mongosh mongodb://localhost:27017/hiv-aids-club
```

Then run:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { 
    $set: { 
      roles: ["admin"],
      isActive: true
    } 
  }
)
```

#### Option 4: Using MongoDB Atlas

1. Login to MongoDB Atlas
2. Go to your cluster
3. Click "Browse Collections"
4. Select your database
5. Find the `users` collection
6. Find your user document
7. Edit and set `roles: ["admin"]`
8. Save changes

**Verify the Fix:**

1. Logout from the application
2. Login again with your credentials
3. Try accessing `/admin`
4. You should now see the admin dashboard

---

### Issue 2: Cannot Login / Invalid Token

**Symptoms:**
- Login fails with "Invalid token"
- Redirected to login page immediately after logging in
- Token expired errors

**Solutions:**

#### Check JWT Secret
```bash
# In server/.env
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

Make sure `JWT_SECRET` is set and is the same across restarts.

#### Clear Browser Storage
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
```

Then try logging in again.

#### Check Token in Browser
```javascript
// In browser console
console.log(localStorage.getItem('token'))
console.log(localStorage.getItem('user'))
```

If token is null or "undefined", you need to login again.

---

### Issue 3: MongoDB Connection Failed

**Symptoms:**
- Server won't start
- Error: "MongooseServerSelectionError"
- "Failed to connect to MongoDB"

**Solutions:**

#### Check MongoDB is Running

**On Mac:**
```bash
brew services list
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl status mongod
sudo systemctl start mongod
```

**On Windows:**
```bash
net start MongoDB
```

#### Check Connection String
```bash
# In server/.env
MONGODB_URI=mongodb://localhost:27017/hiv-aids-club
```

#### Test Connection
```bash
mongosh mongodb://localhost:27017/hiv-aids-club
```

If this fails, MongoDB is not running or the connection string is wrong.

---

### Issue 4: CORS Errors

**Symptoms:**
- "Access to XMLHttpRequest has been blocked by CORS policy"
- API calls fail from frontend
- Network errors in console

**Solutions:**

#### Check Backend CORS Configuration
```javascript
// In server/server.js
app.use(cors({
    origin: 'http://localhost:5173', // Must match frontend URL
    credentials: true
}));
```

#### Check Frontend API URL
```bash
# In client/.env
VITE_API_URL=http://localhost:5000/api
```

#### Verify Both Servers Running
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

### Issue 5: Port Already in Use

**Symptoms:**
- "Error: listen EADDRINUSE: address already in use :::5000"
- Server won't start

**Solutions:**

#### Find and Kill Process

**On Mac/Linux:**
```bash
# Find process on port 5000
lsof -ti:5000

# Kill the process
lsof -ti:5000 | xargs kill -9

# Or for port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

**On Windows:**
```bash
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Change Port
```bash
# In server/.env
PORT=5001
```

---

### Issue 6: User Registration Fails

**Symptoms:**
- Registration form submits but fails
- Validation errors
- "User already exists"

**Solutions:**

#### Check Required Fields
All these fields are required:
- username (3-50 characters)
- email (valid email format)
- password (min 6 characters)
- firstName
- lastName

#### Check for Duplicate Email/Username
```javascript
// In MongoDB
db.users.findOne({ email: "test@example.com" })
db.users.findOne({ username: "testuser" })
```

If user exists, use different email/username or delete the existing user.

#### Check Password Requirements
- Minimum 6 characters
- If strong password required (in settings), must include:
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character

---

### Issue 7: Images Not Loading

**Symptoms:**
- Gallery images show broken
- Event images don't display
- 404 errors for image URLs

**Solutions:**

#### Check Upload Directory
```bash
cd server
ls -la uploads/
```

Make sure the `uploads` directory exists and has proper permissions.

#### Check Static File Serving
```javascript
// In server/server.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

#### Use Full URLs
Instead of relative paths, use full URLs:
```
http://localhost:5000/uploads/image.jpg
```

---

### Issue 8: Admin Dashboard Shows Zero Stats

**Symptoms:**
- Dashboard loads but all stats show 0
- No recent activity
- Empty lists

**Cause:**
No data in the database yet.

**Solution:**

Create sample data:

```javascript
// Connect to MongoDB
mongosh mongodb://localhost:27017/hiv-aids-club

// Create sample event
db.events.insertOne({
  title: "HIV Awareness Workshop",
  description: "Learn about HIV prevention",
  eventType: "workshop",
  startDate: new Date("2025-12-25"),
  endDate: new Date("2025-12-25"),
  location: { venue: "Main Hall" },
  status: "published",
  registrations: [],
  createdAt: new Date()
})

// Create sample story
db.stories.insertOne({
  title: "My Journey",
  content: "This is a sample story...",
  category: "personal_journey",
  status: "published",
  likes: [],
  views: 0,
  createdAt: new Date()
})
```

---

### Issue 9: Cannot Access Member Pages

**Symptoms:**
- Redirected to login when accessing `/member` routes
- "Authentication required" errors

**Solutions:**

#### Check Login Status
```javascript
// In browser console
console.log(localStorage.getItem('token'))
console.log(localStorage.getItem('user'))
```

#### Re-login
1. Logout
2. Clear browser cache
3. Login again

#### Check Token Expiration
Default token expiration is 7 days. If token expired, login again.

---

### Issue 10: System Settings Won't Save

**Symptoms:**
- Settings form submits but changes don't persist
- No error message
- Settings revert after refresh

**Solutions:**

#### Check Admin Role
Only admins can update system settings.

#### Check API Response
Open browser DevTools → Network tab → Check the response from `/api/admin/settings`

#### Check Database
```javascript
db.systemsettings.findOne()
```

If no document exists, one will be created on first save.

---

## 🔍 Debug Tools

### Check Current User Roles (Development Only)

```bash
# Make a request to debug endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/debug/me
```

This will show:
- User ID
- Email
- Username
- Roles array
- Active status

### Check Database Collections

```javascript
// Connect to MongoDB
mongosh mongodb://localhost:27017/hiv-aids-club

// List all collections
show collections

// Count documents
db.users.countDocuments()
db.events.countDocuments()
db.stories.countDocuments()

// Find admin users
db.users.find({ roles: "admin" })
```

### Check API Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}'

# Test admin endpoint (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/dashboard/stats
```

---

## 🛠️ Reset Everything

If all else fails, start fresh:

### 1. Stop All Servers
```bash
# Kill all node processes
pkill -f node

# Or manually stop each terminal
```

### 2. Clear Database
```javascript
mongosh mongodb://localhost:27017/hiv-aids-club
db.dropDatabase()
```

### 3. Clear Browser Data
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
```

### 4. Reinstall Dependencies
```bash
# Backend
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### 5. Start Fresh
```bash
# Start backend
cd server
npm run dev

# Start frontend (new terminal)
cd client
npm run dev
```

### 6. Create Admin User
```bash
# Register through UI first, then:
cd server
node setup-admin.js your-email@example.com
```

---

## 📞 Still Having Issues?

### Collect Debug Information

1. **Backend Logs**
   - Check terminal where backend is running
   - Look for error messages

2. **Frontend Console**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Database State**
   ```javascript
   mongosh mongodb://localhost:27017/hiv-aids-club
   db.users.find().pretty()
   ```

4. **Environment Variables**
   ```bash
   # Backend
   cat server/.env
   
   # Frontend
   cat client/.env
   ```

### Create GitHub Issue

Include:
- Error message
- Steps to reproduce
- Backend logs
- Frontend console errors
- Environment (OS, Node version, MongoDB version)

---

## ✅ Verification Checklist

After fixing issues, verify:

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] MongoDB connected and running
- [ ] Can register new user
- [ ] Can login as regular user
- [ ] Can access member dashboard
- [ ] Admin user has `roles: ["admin"]` in database
- [ ] Can login as admin
- [ ] Can access admin dashboard
- [ ] Admin dashboard shows stats
- [ ] Can manage users
- [ ] Can create events
- [ ] System settings save correctly

---

**Last Updated:** December 22, 2025
