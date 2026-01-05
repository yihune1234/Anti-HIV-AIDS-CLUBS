const eventService = require('./event.service');

class EventController {
    async createEvent(req, res) {
        try {
            const eventData = {
                ...req.body,
                createdBy: req.user._id
            };
            const event = await eventService.createEvent(eventData);
            res.status(201).json({ success: true, message: 'Event created successfully', data: event });
        } catch (error) {
            console.error('Create event error:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getEventById(req, res) {
        try {
            const event = await eventService.getEventById(req.params.id);
            res.status(200).json({ success: true, data: event });
        } catch (error) {
            console.error('Get event by ID error:', error);
            res.status(404).json({ success: false, message: error.message });
        }
    }

    async getAllEvents(req, res) {
        try {
            const { status, eventType, category, isFeatured, isPublic, search, page = 1, limit = 10 } = req.query;
            const filters = {};
            if (status) filters.status = status;
            if (eventType) filters.eventType = eventType;
            if (category) filters.category = category;
            if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
            if (isPublic !== undefined) filters.isPublic = isPublic === 'true';
            if (search) filters.search = search;

            const result = await eventService.getAllEvents(filters, parseInt(page), parseInt(limit));
            res.status(200).json({ success: true, data: result.events, pagination: result.pagination });
        } catch (error) {
            console.error('Get all events error:', error);
            res.status(500).json({ success: false, message: 'Failed to load events' });
        }
    }

    async updateEvent(req, res) {
        try {
            const event = await eventService.updateEvent(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Event updated successfully', data: event });
        } catch (error) {
            console.error('Update event error:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deleteEvent(req, res) {
        try {
            await eventService.deleteEvent(req.params.id);
            res.status(200).json({ success: true, message: 'Event deleted successfully' });
        } catch (error) {
            console.error('Delete event error:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async registerForEvent(req, res) {
        try {
            const event = await eventService.registerForEvent(req.params.id, req.user._id);
            res.status(200).json({ success: true, message: 'Registered for event successfully', data: event });
        } catch (error) {
            console.error('Register for event error:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async unregisterFromEvent(req, res) {
        try {
            const event = await eventService.unregisterFromEvent(req.params.id, req.user._id);
            res.status(200).json({ success: true, message: 'Unregistered from event successfully', data: event });
        } catch (error) {
            console.error('Unregister from event error:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getUserRegistrations(req, res) {
        try {
            const events = await eventService.getUserRegistrations(req.user._id);
            res.status(200).json({ success: true, data: events });
        } catch (error) {
            console.error('Get user registrations error:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getEventStats(req, res) {
        try {
            const stats = await eventService.getEventStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            console.error('Get event stats error:', error);
            res.status(500).json({ success: false, message: 'Failed to load event statistics' });
        }
    }
}

module.exports = new EventController();
