const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');

// Public routes
router.get('/public-settings', adminController.getPublicSettings);

// All routes below require authentication and at least admin role
router.use(protect);

// User Management (Super Admin Only for sensitive actions)
router.get('/users', restrictTo('superadmin'), adminController.getAllUsers);
router.get('/users/:id', restrictTo('superadmin'), adminController.getUserById);
router.patch('/users/:id/roles', restrictTo('superadmin'), adminController.updateUserRoles);
router.patch('/users/:id/status', restrictTo('superadmin'), adminController.updateUserStatus);
router.delete('/users/:id', restrictTo('superadmin'), adminController.deleteUser);

// Event Attendance Management (Both Admin and Super Admin)
router.get('/events/:id/attendees', restrictTo('superadmin', 'admin'), adminController.getEventAttendees);
router.patch('/events/:id/attendees/:userId', restrictTo('superadmin', 'admin'), adminController.markAttendance);
router.get('/events/attendance/report', restrictTo('superadmin'), adminController.getAttendanceReport);

// Session Attendance Management (Both Admin and Super Admin)
router.get('/sessions/:id/attendees', restrictTo('superadmin', 'admin'), adminController.getSessionAttendees);
router.patch('/sessions/:id/attendees/:userId', restrictTo('superadmin', 'admin'), adminController.markSessionAttendance);

// System Settings (Super Admin Only)
router.get('/settings', restrictTo('superadmin'), adminController.getSystemSettings);
router.patch('/settings', restrictTo('superadmin'), adminController.updateSystemSettings);

// Dashboard Statistics (Super Admin for full reports, Admin might need restricted view)
router.get('/dashboard/stats', restrictTo('superadmin', 'admin'), adminController.getDashboardStats);
router.get('/dashboard/recent-activity', restrictTo('superadmin', 'admin'), adminController.getRecentActivity);

// Content Management (Both Admin and Super Admin)
router.get('/content/pending', restrictTo('superadmin', 'admin'), adminController.getPendingContent);
router.patch('/content/:type/:id/approve', restrictTo('superadmin', 'admin'), adminController.approveContent);
router.patch('/content/:type/:id/reject', restrictTo('superadmin', 'admin'), adminController.rejectContent);

// Reports (Super Admin Only)
router.get('/reports/users', restrictTo('superadmin'), adminController.getUsersReport);
router.get('/reports/events', restrictTo('superadmin'), adminController.getEventsReport);
router.get('/reports/sessions', restrictTo('superadmin'), adminController.getSessionsReport);

// Member Contacts (Admin can view member contacts)
router.get('/member-contacts', restrictTo('superadmin', 'admin'), adminController.getAllMemberContacts);

module.exports = router;
