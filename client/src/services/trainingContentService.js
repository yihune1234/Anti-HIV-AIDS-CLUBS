import api from './api';

const trainingContentService = {
    // Get all content (public/members)
    getAllContent: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.contentType) params.append('contentType', filters.contentType);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await api.get(`/training-content?${params.toString()}`);
        return response.data;
    },

    // Get featured content
    getFeaturedContent: async (limit = 5) => {
        const response = await api.get(`/training-content/featured?limit=${limit}`);
        return response.data;
    },

    // Get content by ID
    getContentById: async (id) => {
        const response = await api.get(`/training-content/${id}`);
        return response.data;
    },

    // Mark content as completed
    markCompleted: async (id, completionData = {}) => {
        const response = await api.post(`/training-content/${id}/complete`, completionData);
        return response.data;
    },

    // Get user's completed content
    getMyCompletions: async () => {
        const response = await api.get('/training-content/my/completions');
        return response.data;
    },

    // Record download
    recordDownload: async (id) => {
        const response = await api.post(`/training-content/${id}/download`);
        return response.data;
    },

    // Admin: Create content
    createContent: async (contentData) => {
        const response = await api.post('/training-content/admin/create', contentData);
        return response.data;
    },

    // Admin: Update content
    updateContent: async (id, contentData) => {
        const response = await api.put(`/training-content/admin/${id}`, contentData);
        return response.data;
    },

    // Admin: Delete content
    deleteContent: async (id) => {
        const response = await api.delete(`/training-content/admin/${id}`);
        return response.data;
    },

    // Admin: Get statistics
    getContentStats: async () => {
        const response = await api.get('/training-content/admin/stats/overview');
        return response.data;
    }
};

export default trainingContentService;
