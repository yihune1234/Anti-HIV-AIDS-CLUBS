import api from './api';

const sessionService = {
    // Get all sessions (member view)
    getAllSessions: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.topic) params.append('topic', filters.topic);
        if (filters.educator) params.append('educator', filters.educator);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await api.get(`/sessions?${params.toString()}`);
        return response.data;
    },

    // Get session by ID
    getSessionById: async (id) => {
        const response = await api.get(`/sessions/${id}`);
        return response.data;
    },

    // Mark participation in a session
    markParticipation: async (sessionId) => {
        const response = await api.post(`/sessions/${sessionId}/participate`);
        return response.data;
    },

    // Get user's participation history
    getMyParticipation: async () => {
        const response = await api.get('/sessions/my/participation');
        return response.data;
    },

    // Get sessions by educator
    getEducatorSessions: async (educatorId) => {
        const response = await api.get(`/sessions/educator/${educatorId}`);
        return response.data;
    },

    // Admin: Create session
    createSession: async (sessionData) => {
        const response = await api.post('/sessions/admin/create', sessionData);
        return response.data;
    },

    // Admin: Update session
    updateSession: async (id, sessionData) => {
        const response = await api.put(`/sessions/admin/${id}`, sessionData);
        return response.data;
    },

    // Admin: Delete session
    deleteSession: async (id) => {
        const response = await api.delete(`/sessions/admin/${id}`);
        return response.data;
    },

    // Admin: Get session attendance
    getSessionAttendance: async (id) => {
        const response = await api.get(`/sessions/admin/${id}/attendance`);
        return response.data;
    },

    // Admin: Mark attendance
    markAttendance: async (sessionId, userId, attended) => {
        const response = await api.post(`/sessions/admin/${sessionId}/attendance`, {
            userId,
            attended
        });
        return response.data;
    },

    // Admin: Get session statistics
    getSessionStats: async () => {
        const response = await api.get('/sessions/admin/stats/overview');
        return response.data;
    }
};

export default sessionService;
