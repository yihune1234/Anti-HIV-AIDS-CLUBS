# 🔐 Admin Login Credentials

## Default Admin Account

An admin user has been created for you with the following credentials:

### Login Information
```
Email:    admin@huclub.com
Password: Admin123!
Username: admin
```

### Access URLs
- **Login Page:** http://localhost:5173/login
- **Admin Dashboard:** http://localhost:5173/admin

---

## 🚀 How to Login

1. **Open your browser** and go to: http://localhost:5173/login

2. **Enter credentials:**
   - Email: `admin@huclub.com`
   - Password: `Admin123!`

3. **Click "Login"**

4. **Access Admin Panel:**
   - You'll be redirected to the member dashboard
   - Navigate to: http://localhost:5173/admin
   - Or look for "Admin Panel" link in navigation

---

## ✅ What You Can Do Now

### Admin Dashboard
- View real-time statistics
- See recent activity
- Quick access to all admin features

### User Management (`/admin/members`)
- View all users
- Search and filter users
- Change user roles
- Activate/deactivate accounts
- Delete users

### Event Management (`/admin/events`)
- Create new events
- Edit existing events
- Delete events
- Track registrations
- Mark attendance

### Content Management
- **Stories** (`/admin/stories`) - Manage stories
- **Gallery** (`/admin/gallery`) - Manage photos
- **Questions** (`/admin/questions`) - Answer anonymous questions

### Content Approval (`/admin/content-approval`)
- Review pending stories
- Review pending resources
- Review pending gallery items
- Approve or reject with notes

### System Settings (`/admin/settings`)
- Configure site name and description
- Update contact information
- Manage social media links
- Toggle features on/off
- Set security policies
- Configure notifications

### Reports (`/admin/reports`)
- Generate user reports
- Generate event reports
- Generate session reports
- Track attendance
- Export to CSV

---

## 🔧 Useful Commands

### List All Users
```bash
cd server
npm run list-users
```

### Create Another Admin
```bash
cd server
npm run quick-admin
```

### Make Existing User Admin
```bash
cd server
npm run setup-admin user@example.com
```

### Create Custom Admin (Interactive)
```bash
cd server
npm run create-admin
```

---

## ⚠️ Security Recommendations

1. **Change the default password** after first login
   - Go to your profile
   - Update password to something secure

2. **Create additional admin accounts** with different emails
   ```bash
   npm run create-admin
   ```

3. **Use strong passwords** for all admin accounts
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, symbols

4. **Don't share admin credentials**
   - Each admin should have their own account

5. **Regularly review user accounts**
   - Check for suspicious activity
   - Remove inactive admins

---

## 🐛 Troubleshooting

### Can't Login?
1. Make sure backend server is running: `npm run dev` in server folder
2. Make sure frontend server is running: `npm run dev` in client folder
3. Check MongoDB connection in server/.env

### Still Getting 403 Errors?
1. Logout completely
2. Clear browser cache (Ctrl+Shift+Delete)
3. Login again with admin credentials
4. Try accessing /admin again

### Forgot Password?
Run this to reset:
```bash
cd server
node quick-admin.js
```
This will show you the default credentials or update existing admin.

---

## 📞 Need Help?

- **Quick Fix Guide:** [FIX_ADMIN_ACCESS.md](FIX_ADMIN_ACCESS.md)
- **Setup Guide:** [ADMIN_SETUP_GUIDE.md](ADMIN_SETUP_GUIDE.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Full Documentation:** [README.md](README.md)

---

## 🎉 You're All Set!

Your admin account is ready to use. Login and start managing your platform!

**Login URL:** http://localhost:5173/login
**Email:** admin@huclub.com
**Password:** Admin123!

---

**Created:** December 22, 2025
**Status:** ✅ Active and Ready
