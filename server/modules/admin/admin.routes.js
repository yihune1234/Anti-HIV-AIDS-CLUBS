const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');

// All routes require admin authentication
router.use(protect);
router.use(restrictTo('admin'));

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/roles', adminController.updateUserRoles);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Event Attendance Management
router.get('/events/:id/attendees', adminController.getEventAttendees);
router.patch('/events/:id/attendees/:userId', adminController.markAttendance);
router.get('/events/attendance/report', adminController.getAttendanceReport);

// Session Attendance Management
router.get('/sessions/:id/attendees', adminController.getSessionAttendees);
router.patch('/sessions/:id/attendees/:userId', adminController.markSessionAttendance);

// System Settings
router.get('/settings', adminController.getSystemSettings);
router.patch('/settings', adminController.updateSystemSettings);

// Dashboard Statistics
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/recent-activity', adminController.getRecentActivity);

// Content Management
router.get('/content/pending', adminController.getPendingContent);
router.patch('/content/:type/:id/approve', adminController.approveContent);
router.patch('/content/:type/:id/reject', adminController.rejectContent);

// Reports
router.get('/reports/users', adminController.getUsersReport);
router.get('/reports/events', adminController.getEventsReport);
router.get('/reports/sessions', adminController.getSessionsReport);

module.exports = router;
