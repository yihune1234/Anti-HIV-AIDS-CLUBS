const Event = require('../../models/Event');

class EventService {
    async createEvent(data) {
        try {
            const event = new Event(data);
            await event.save();
            await event.populate('organizers advisors');
            return event;
        } catch (error) {
            throw error;
        }
    }

    async getEventById(id) {
        try {
            const event = await Event.findById(id)
                .populate('organizers', 'user studentId')
                .populate('advisors', 'user staffId')
                .populate('registrations.user', '-password');
            if (!event) throw new Error('Event not found');
            return event;
        } catch (error) {
            throw error;
        }
    }

    async getAllEvents(filters = {}, page = 1, limit = 10) {
        try {
            const query = {};
            if (filters.status) query.status = filters.status;
            if (filters.eventType) query.eventType = filters.eventType;
            if (filters.category) query.category = filters.category;
            if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
            if (filters.isPublic !== undefined) query.isPublic = filters.isPublic;
            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } }
                ];
            }

            const skip = (page - 1) * limit;
            const events = await Event.find(query)
                .populate(['organizers', 'advisors'])
                .skip(skip)
                .limit(limit)
                .sort({ startDate: -1 });

            const total = await Event.countDocuments(query);
            return { events, pagination: { total, page, pages: Math.ceil(total / limit), limit } };
        } catch (error) {
            throw error;
        }
    }

    async updateEvent(id, data) {
        try {
            const event = await Event.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
                .populate('organizers advisors');
            if (!event) throw new Error('Event not found');
            return event;
        } catch (error) {
            throw error;
        }
    }

    async deleteEvent(id) {
        try {
            const event = await Event.findByIdAndDelete(id);
            if (!event) throw new Error('Event not found');
            return { message: 'Event deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    async registerForEvent(eventId, userId) {
        try {
            const event = await Event.findById(eventId);
            if (!event) throw new Error('Event not found');
            
            // Check if already registered
            const existingRegistration = event.registrations.find(r => 
                r.user && r.user.toString() === userId.toString()
            );
            if (existingRegistration) {
                throw new Error('Already registered for this event');
            }
            
            // Check if registration is required
            if (!event.registrationRequired) {
                throw new Error('Registration is not required for this event');
            }
            
            // Check registration time window
            const now = new Date();
            if (event.registrationOpenTime && now < event.registrationOpenTime) {
                throw new Error('Registration has not opened yet');
            }
            if (event.registrationCloseTime && now > event.registrationCloseTime) {
                throw new Error('Registration has closed');
            }
            
            // Check capacity
            if (event.capacity && event.registrations.length >= event.capacity) {
                throw new Error('Event is full');
            }
            
            // Check if event is in the future
            if (new Date(event.startDate) <= new Date()) {
                throw new Error('Cannot register for past events');
            }

            event.registrations.push({ 
                user: userId,
                registrationDate: new Date()
            });
            
            await event.save();
            await event.populate('registrations.user', 'firstName lastName email');
            return event;
        } catch (error) {
            throw error;
        }
    }

    async unregisterFromEvent(eventId, userId) {
        try {
            const event = await Event.findById(eventId);
            if (!event) throw new Error('Event not found');
            
            // Check if user is registered
            const registrationIndex = event.registrations.findIndex(r => 
                r.user && r.user.toString() === userId.toString()
            );
            
            if (registrationIndex === -1) {
                throw new Error('Not registered for this event');
            }
            
            // Check if cancellation is allowed
            if (!event.allowCancellation) {
                throw new Error('Cancellation not allowed for this event');
            }
            
            // Check if registration period has ended
            const now = new Date();
            if (event.registrationCloseDate && now > new Date(event.registrationCloseDate)) {
                throw new Error('Registration period has ended, cannot cancel');
            }
            
            // Remove registration
            event.registrations.splice(registrationIndex, 1);
            await event.save();
            
            await event.populate('registrations.user', 'firstName lastName email');
            return event;
        } catch (error) {
            throw error;
        }
    }

    async getUserRegistrations(userId) {
        try {
            const events = await Event.find({
                'registrations.user': userId
            }).populate('organizers advisors');
            
            return events;
        } catch (error) {
            throw error;
        }
    }

    async getEventStats() {
        try {
            const total = await Event.countDocuments();
            const upcoming = await Event.countDocuments({ startDate: { $gte: new Date() }, status: 'upcoming' });
            const byType = await Event.aggregate([{ $group: { _id: '$eventType', count: { $sum: 1 } } }]);
            const byCategory = await Event.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);

            return { total, upcoming, byType, byCategory };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new EventService();
