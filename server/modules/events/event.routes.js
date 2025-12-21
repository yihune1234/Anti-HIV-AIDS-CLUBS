const express = require('express');
const router = express.Router();
const eventController = require('./event.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { createEventSchema, updateEventSchema } = require('./event.validation');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes
router.use(authenticate);

router.post('/:id/register', eventController.registerForEvent);

// Admin/Organizer routes
router.get('/stats', authorize('admin'), eventController.getEventStats);
router.post('/', authorize('admin'), validate(createEventSchema), eventController.createEvent);
router.put('/:id', authorize('admin'), validate(updateEventSchema), eventController.updateEvent);
router.delete('/:id', authorize('admin'), eventController.deleteEvent);

module.exports = router;
