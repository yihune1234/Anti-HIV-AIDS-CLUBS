const eventService = require('./event.service');

class EventController {
    async createEvent(req, res) {
        try {
            const event = await eventService.createEvent(req.body);
            res.status(201).json({ success: true, message: 'Event created successfully', data: event });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getEventById(req, res) {
        try {
            const event = await eventService.getEventById(req.params.id);
            res.status(200).json({ success: true, data: event });
        } catch (error) {
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
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async updateEvent(req, res) {
        try {
            const event = await eventService.updateEvent(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Event updated successfully', data: event });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deleteEvent(req, res) {
        try {
            await eventService.deleteEvent(req.params.id);
            res.status(200).json({ success: true, message: 'Event deleted successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async registerForEvent(req, res) {
        try {
            const event = await eventService.registerForEvent(req.params.id, req.user.id);
            res.status(200).json({ success: true, message: 'Registered for event successfully', data: event });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getEventStats(req, res) {
        try {
            const stats = await eventService.getEventStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EventController();
