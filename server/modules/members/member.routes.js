const express = require('express');
const router = express.Router();
const memberController = require('./member.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const {
    createMemberSchema,
    updateMemberSchema,
    addEventAttendanceSchema,
    addSessionAttendanceSchema
} = require('./member.validation');

// All routes require authentication
router.use(authenticate);

// Get current user's member profile
router.get('/me', memberController.getMyMemberProfile);

// Get top volunteers
router.get('/top-volunteers', memberController.getTopVolunteers);

// Get member statistics (admin only)
router.get('/stats', authorize('admin'), memberController.getMemberStats);

// Get all members
router.get('/', memberController.getAllMembers);

// Get member by ID
router.get('/:id', memberController.getMemberById);

// Create new member (admin only)
router.post('/', authorize('admin'), validate(createMemberSchema), memberController.createMember);

// Update member (admin or member themselves)
router.put('/:id', validate(updateMemberSchema), memberController.updateMember);

// Add event attendance
router.post('/:id/events', validate(addEventAttendanceSchema), memberController.addEventAttendance);

// Remove event attendance
router.delete('/:id/events/:eventId', memberController.removeEventAttendance);

// Add session attendance
router.post('/:id/sessions', validate(addSessionAttendanceSchema), memberController.addSessionAttendance);

// Update volunteer hours (admin only)
router.patch('/:id/volunteer-hours', authorize('admin'), memberController.updateVolunteerHours);

// Delete member (admin only)
router.delete('/:id', authorize('admin'), memberController.deleteMember);

module.exports = router;
