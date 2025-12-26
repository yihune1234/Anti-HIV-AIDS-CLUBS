import api from './api';

const adminService = {
    // Dashboard Statistics
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },

    getRecentActivity: async (limit = 10) => {
        const response = await api.get(`/admin/dashboard/recent-activity?limit=${limit}`);
        return response.data;
    },

    // User Management
    getAllUsers: async (params = {}) => {
        const { page = 1, limit = 20, role, status, search } = params;
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (role) queryParams.append('role', role);
        if (status) queryParams.append('status', status);
        if (search) queryParams.append('search', search);
        
        const response = await api.get(`/admin/users?${queryParams.toString()}`);
        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    updateUserRoles: async (id, roles) => {
        const response = await api.patch(`/admin/users/${id}/roles`, { roles });
        return response.data;
    },

    updateUserStatus: async (id, data) => {
        const response = await api.patch(`/admin/users/${id}/status`, data);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    // Event Attendance Management
    getEventAttendees: async (eventId) => {
        const response = await api.get(`/admin/events/${eventId}/attendees`);
        return response.data;
    },

    markAttendance: async (eventId, userId, attended) => {
        const response = await api.patch(`/admin/events/${eventId}/attendees/${userId}`, { attended });
        return response.data;
    },

    getAttendanceReport: async (startDate, endDate) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const response = await api.get(`/admin/events/attendance/report?${params.toString()}`);
        return response.data;
    },

    // Session Attendance Management
    getSessionAttendees: async (sessionId) => {
        const response = await api.get(`/admin/sessions/${sessionId}/attendees`);
        return response.data;
    },

    markSessionAttendance: async (sessionId, userId, attended) => {
        const response = await api.patch(`/admin/sessions/${sessionId}/attendees/${userId}`, { attended });
        return response.data;
    },

    // System Settings
    getSystemSettings: async () => {
        const response = await api.get('/admin/settings');
        return response.data;
    },

    updateSystemSettings: async (settings) => {
        const response = await api.patch('/admin/settings', settings);
        return response.data;
    },

    // Content Management
    getPendingContent: async () => {
        const response = await api.get('/admin/content/pending');
        return response.data;
    },

    approveContent: async (type, id, notes = '') => {
        const response = await api.patch(`/admin/content/${type}/${id}/approve`, { notes });
        return response.data;
    },

    rejectContent: async (type, id, notes = '') => {
        const response = await api.patch(`/admin/content/${type}/${id}/reject`, { notes });
        return response.data;
    },

    // Reports
    getUsersReport: async () => {
        const response = await api.get('/admin/reports/users');
        return response.data;
    },

    getEventsReport: async () => {
        const response = await api.get('/admin/reports/events');
        return response.data;
    },

    getSessionsReport: async () => {
        const response = await api.get('/admin/reports/sessions');
        return response.data;
    }
};

export default adminService;
