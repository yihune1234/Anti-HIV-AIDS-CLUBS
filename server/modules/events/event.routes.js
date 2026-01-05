const express = require('express');
const router = express.Router();
const eventController = require('./event.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { createEventSchema, updateEventSchema } = require('./event.validation');

// Public routes
// Public routes
router.get('/', eventController.getAllEvents);

// Protected routes (higher priority routes first)
router.use(authenticate);

router.get('/stats', authorize('admin'), eventController.getEventStats);
router.post('/:id/register', eventController.registerForEvent);
router.delete('/:id/register', eventController.unregisterFromEvent);
router.get('/my/registrations', eventController.getUserRegistrations);

// Admin/Organizer routes
router.post('/', authorize('admin'), validate(createEventSchema), eventController.createEvent);
router.put('/:id', authorize('admin'), validate(updateEventSchema), eventController.updateEvent);
router.delete('/:id', authorize('admin'), eventController.deleteEvent);

// Public route that might shadow others if placed earlier
router.get('/:id', eventController.getEventById);

module.exports = router;
