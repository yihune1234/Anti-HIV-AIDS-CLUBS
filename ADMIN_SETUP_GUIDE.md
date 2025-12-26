# 👨‍💼 Admin Setup Guide

## 🎯 Goal
Set up your first admin user to access the admin panel.

---

## 📋 Prerequisites

✅ Backend server is running (`npm run dev` in server folder)
✅ Frontend server is running (`npm run dev` in client folder)  
✅ MongoDB is running
✅ You have registered a user account

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Register a User Account

1. Open your browser: http://localhost:5173
2. Click "Register" or go to http://localhost:5173/register
3. Fill in the registration form:
   ```
   Username: admin
   Email: admin@example.com
   Password: Admin123
   First Name: Admin
   Last Name: User
   Department: Administration
   Year: 1
   ```
4. Click "Register"
5. You'll be logged in as a regular member

---

### Step 2: Make User an Admin

Open a new terminal and run:

```bash
cd server
npm run setup-admin admin@example.com
```

Or directly:
```bash
cd server
node setup-admin.js admin@example.com
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ Admin user setup successful!

📋 User Details:
   Email: admin@example.com
   Username: admin
   Name: Admin User
   Roles: admin
   Active: true

🎉 You can now login as admin!
```

---

### Step 3: Login as Admin

1. **Logout** from the current session
   - Click your profile/logout button
   - Or go to http://localhost:5173/login

2. **Login** with admin credentials
   - Email: admin@example.com
   - Password: Admin123

3. **Access Admin Panel**
   - Go to http://localhost:5173/admin
   - Or click "Admin Panel" in navigation (if available)

4. **Success!** 🎉
   - You should see the admin dashboard
   - Stats showing users, events, sessions, stories
   - Navigation sidebar with admin options

---

## 🎨 What You'll See

### Admin Dashboard
```
┌─────────────────────────────────────────────┐
│  Admin Dashboard                            │
├─────────────────────────────────────────────┤
│                                             │
│  👥 Total Users    📅 Total Events         │
│     150               25                    │
│                                             │
│  🎓 Sessions       📝 Pending Stories      │
│     40                8                     │
│                                             │
├─────────────────────────────────────────────┤
│  Recent Users  │  Recent Events  │ Stories │
└─────────────────────────────────────────────┘
```

### Admin Navigation
```
📊 Dashboard
👥 Manage Members
📅 Manage Events
🖼️ Manage Gallery
📝 Manage Stories
❓ Anonymous Q&A
─────────────────
✅ Content Approval
📈 Reports
⚙️ System Settings
─────────────────
🏠 View Member Site
```

---

## 🔧 Alternative Methods

### Method A: MongoDB Compass (GUI)

1. **Install MongoDB Compass**
   - Download: https://www.mongodb.com/products/compass

2. **Connect**
   - URI: `mongodb://localhost:27017`

3. **Navigate**
   - Database: `hiv-aids-club`
   - Collection: `users`

4. **Edit User**
   - Find your user by email
   - Edit document
   - Set `roles: ["admin"]`
   - Set `isActive: true`
   - Save

5. **Logout and Login Again**

---

### Method B: MongoDB Shell

```bash
# Connect to database
mongosh mongodb://localhost:27017/hiv-aids-club

# Update user to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { roles: ["admin"], isActive: true } }
)

# Verify
db.users.findOne({ email: "admin@example.com" })

# Exit
exit
```

---

## ✅ Verification

### Check 1: User Object in Browser
```javascript
// Open browser console (F12)
console.log(JSON.parse(localStorage.getItem('user')))

// Should show:
{
  email: "admin@example.com",
  roles: ["admin"],  // ← Must have this!
  ...
}
```

### Check 2: Test Admin API
```javascript
// In browser console
fetch('http://localhost:5000/api/admin/dashboard/stats', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)

// Should return stats, not 403 error
```

### Check 3: Access Admin Routes
- ✅ http://localhost:5173/admin - Dashboard
- ✅ http://localhost:5173/admin/members - User management
- ✅ http://localhost:5173/admin/settings - System settings

---

## 🚨 Troubleshooting

### Problem: "User not found"
**Solution:** Register the user first through the application

### Problem: Still getting 403 errors
**Solution:** 
1. Logout completely
2. Clear browser cache (Ctrl+Shift+Delete)
3. Login again

### Problem: Script won't run
**Solution:**
```bash
# Make sure you're in the server directory
cd server

# Check if file exists
ls -la setup-admin.js

# Run with node directly
node setup-admin.js admin@example.com
```

### Problem: MongoDB connection error
**Solution:**
```bash
# Check if MongoDB is running
mongosh mongodb://localhost:27017

# If not running, start it:
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB
```

---

## 📚 Next Steps

Once you're logged in as admin:

1. **Configure System Settings**
   - Go to Admin → System Settings
   - Update site name, contact info
   - Configure social media links

2. **Create Sample Content**
   - Add a few events
   - Upload gallery images
   - Create sample stories

3. **Invite Members**
   - Share registration link
   - Approve new members
   - Assign roles as needed

4. **Explore Admin Features**
   - User management
   - Content approval
   - Reports and analytics
   - Attendance tracking

---

## 🎓 Admin Capabilities

As an admin, you can:

### User Management
- ✅ View all users
- ✅ Edit user roles
- ✅ Activate/deactivate accounts
- ✅ Delete users
- ✅ Search and filter users

### Content Management
- ✅ Create/edit/delete events
- ✅ Create/edit/delete stories
- ✅ Upload/manage gallery images
- ✅ Upload/manage resources
- ✅ Approve/reject pending content

### System Administration
- ✅ Configure system settings
- ✅ Manage site information
- ✅ Toggle features on/off
- ✅ Set security policies
- ✅ Configure notifications

### Analytics & Reports
- ✅ View dashboard statistics
- ✅ Generate user reports
- ✅ Generate event reports
- ✅ Track attendance
- ✅ Export data to CSV

### Q&A Management
- ✅ View anonymous questions
- ✅ Answer questions
- ✅ Manage Q&A history

---

## 💡 Pro Tips

1. **Create Multiple Admins**
   ```bash
   npm run setup-admin user1@example.com
   npm run setup-admin user2@example.com
   ```

2. **Use Different Roles**
   - `admin` - Full access
   - `moderator` - Content moderation
   - `content_manager` - Content creation
   - `peer_educator` - Education sessions
   - `advisor` - Advisory role
   - `member` - Basic access

3. **Backup Admin Credentials**
   - Keep admin email/password secure
   - Create backup admin account
   - Document admin procedures

4. **Regular Maintenance**
   - Review pending content weekly
   - Check user registrations
   - Monitor system health
   - Update settings as needed

---

## 📞 Need Help?

- **Quick Fix:** [FIX_ADMIN_ACCESS.md](FIX_ADMIN_ACCESS.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Full Documentation:** [README.md](README.md)

---

**You're all set! Welcome to the admin panel! 🎉**
