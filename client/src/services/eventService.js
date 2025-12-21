import api from './api';

const eventService = {
    getAllEvents: async () => {
        const response = await api.get('/events');
        return response.data;
    },
    getEventById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },
    registerForEvent: async (id) => {
        const response = await api.post(`/events/${id}/register`);
        return response.data;
    },
    // Admin: Get Event Stats
    getEventStats: async () => {
        try {
            const response = await api.get('/events/stats');
            return response.data;
        } catch (error) {
            console.warn('Failed to fetch event stats:', error);
            return { data: { totalEvents: 0 } };
        }
    },
    // Admin: Create Event
    createEvent: async (eventData) => {
        try {
            const response = await api.post('/events', eventData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create event';
        }
    },

    // Admin: Update Event
    updateEvent: async (id, eventData) => {
        try {
            const response = await api.put(`/events/${id}`, eventData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update event';
        }
    },

    // Admin: Delete Event
    deleteEvent: async (id) => {
        try {
            const response = await api.delete(`/events/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete event';
        }
    }
};

export default eventService;
