const express = require('express');
const router = express.Router();
const sessionController = require('./session.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { validate, createSessionSchema, updateSessionSchema, markAttendanceSchema } = require('./session.validation');

// Public routes - NONE (sessions only visible to logged-in members)

// Member routes (authenticated users)
router.get(
    '/',
    authenticate,
    sessionController.getAllSessions
);

router.get(
    '/:id',
    authenticate,
    sessionController.getSessionById
);

router.post(
    '/:id/participate',
    authenticate,
    sessionController.markParticipation
);

router.get(
    '/my/participation',
    authenticate,
    sessionController.getUserParticipation
);

router.get(
    '/educator/:educatorId',
    authenticate,
    sessionController.getEducatorSessions
);

// Admin routes
router.post(
    '/admin/create',
    authenticate,
    authorize('admin'),
    validate(createSessionSchema),
    sessionController.createSession
);

router.put(
    '/admin/:id',
    authenticate,
    authorize('admin'),
    validate(updateSessionSchema),
    sessionController.updateSession
);

router.delete(
    '/admin/:id',
    authenticate,
    authorize('admin'),
    sessionController.deleteSession
);

router.get(
    '/admin/:id/attendance',
    authenticate,
    authorize('admin'),
    sessionController.getSessionAttendance
);

router.post(
    '/admin/:id/attendance',
    authenticate,
    authorize('admin'),
    validate(markAttendanceSchema),
    sessionController.markAttendance
);

router.get(
    '/admin/stats/overview',
    authenticate,
    authorize('admin'),
    sessionController.getSessionStats
);

module.exports = router;
