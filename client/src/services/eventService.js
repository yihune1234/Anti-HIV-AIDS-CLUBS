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
        const response = await api.post('/events', eventData);
        return response.data;
    },

    // Admin: Update Event
    updateEvent: async (id, eventData) => {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
    },

    // Admin: Delete Event
    deleteEvent: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    }
};

export default eventService;
