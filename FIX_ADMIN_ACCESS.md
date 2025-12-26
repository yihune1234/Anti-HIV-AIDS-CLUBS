# 🔧 Quick Fix: Admin Access 403 Error

## Problem
You're getting 403 (Forbidden) errors when trying to access admin routes.

## Root Cause
Your user account doesn't have the admin role assigned in the database.

## ✅ Solution (Choose One Method)

### Method 1: Using the Setup Script (EASIEST)

1. **Make sure you're registered first**
   - Go to http://localhost:5173/register
   - Create an account (if you haven't already)
   - Remember your email address

2. **Run the setup script**
   ```bash
   cd server
   node setup-admin.js your-email@example.com
   ```

   Example:
   ```bash
   node setup-admin.js admin@example.com
   ```

3. **You should see:**
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

4. **Logout and login again**
   - Go to http://localhost:5173/login
   - Login with your credentials
   - Navigate to http://localhost:5173/admin
   - ✅ Admin dashboard should now work!

---

### Method 2: Using MongoDB Compass (GUI)

1. **Download and install MongoDB Compass** (if not installed)
   - https://www.mongodb.com/products/compass

2. **Connect to your database**
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

3. **Navigate to your database**
   - Database: `hiv-aids-club`
   - Collection: `users`

4. **Find your user**
   - Look for your email address
   - Click on the document

5. **Edit the document**
   - Find the `roles` field
   - Change it to: `["admin"]`
   - Make sure `isActive` is `true`
   - Click "Update"

6. **Logout and login again**

---

### Method 3: Using MongoDB Shell

1. **Open MongoDB shell**
   ```bash
   mongosh mongodb://localhost:27017/hiv-aids-club
   ```

2. **Update your user**
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

3. **Verify the update**
   ```javascript
   db.users.findOne({ email: "your-email@example.com" })
   ```

   You should see:
   ```javascript
   {
     _id: ObjectId("..."),
     email: "your-email@example.com",
     roles: ["admin"],  // ← This should be an array with "admin"
     isActive: true,    // ← This should be true
     ...
   }
   ```

4. **Logout and login again**

---

## 🔍 Verify It's Fixed

### Step 1: Check Your Token
Open browser console (F12) and run:
```javascript
console.log(JSON.parse(localStorage.getItem('user')))
```

You should see:
```javascript
{
  email: "your-email@example.com",
  roles: ["admin"],  // ← Must have this
  ...
}
```

### Step 2: Test Admin Endpoint
In browser console:
```javascript
fetch('http://localhost:5000/api/debug/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)
```

You should see:
```javascript
{
  success: true,
  user: {
    email: "your-email@example.com",
    roles: ["admin"],  // ← Must have this
    isActive: true
  }
}
```

### Step 3: Access Admin Dashboard
1. Go to http://localhost:5173/admin
2. You should see the admin dashboard with stats
3. No more 403 errors! ✅

---

## 🚨 Still Not Working?

### Check These:

1. **Did you logout and login again?**
   - The token needs to be refreshed
   - Click logout, then login again

2. **Is the backend running?**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"success":true,"message":"Server is running"}`

3. **Is MongoDB running?**
   ```bash
   mongosh mongodb://localhost:27017
   ```
   Should connect without errors

4. **Check the user in database**
   ```javascript
   mongosh mongodb://localhost:27017/hiv-aids-club
   db.users.findOne({ email: "your-email@example.com" })
   ```
   
   Verify:
   - `roles: ["admin"]` (must be an array)
   - `isActive: true`

5. **Clear browser cache**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

---

## 📝 Quick Reference

### User Must Have:
```javascript
{
  roles: ["admin"],  // Array with "admin" string
  isActive: true     // Boolean true
}
```

### Common Mistakes:
❌ `roles: "admin"` (string instead of array)
❌ `role: "admin"` (wrong field name)
❌ `roles: []` (empty array)
❌ `isActive: false` (account disabled)

✅ `roles: ["admin"]` (correct!)

---

## 🎉 Success!

Once fixed, you'll have access to:
- ✅ Admin Dashboard (`/admin`)
- ✅ User Management (`/admin/members`)
- ✅ Event Management (`/admin/events`)
- ✅ Content Approval (`/admin/content-approval`)
- ✅ System Settings (`/admin/settings`)
- ✅ Reports (`/admin/reports`)

---

**Need more help?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed debugging steps.
