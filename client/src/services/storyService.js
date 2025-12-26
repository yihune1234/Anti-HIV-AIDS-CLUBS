import api from './api';

const storyService = {
    getAllStories: async (params) => {
        const response = await api.get('/stories', { params });
        return response.data;
    },
    getStoryById: async (id) => {
        const response = await api.get(`/stories/${id}`);
        return response.data;
    },
    // Admin: Create Story
    createStory: async (storyData) => {
        try {
            const response = await api.post('/stories', storyData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create story';
        }
    },
    // Admin: Update Story
    updateStory: async (id, storyData) => {
        try {
            const response = await api.put(`/stories/${id}`, storyData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update story';
        }
    },
    // Admin: Delete Story
    deleteStory: async (id) => {
        try {
            const response = await api.delete(`/stories/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete story';
        }
    },
    // Admin: Approve Story
    approveStory: async (id) => {
        try {
            const response = await api.patch(`/stories/${id}/approve`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to approve story';
        }
    },
    likeStory: async (id) => {
        const response = await api.post(`/stories/${id}/like`);
        return response.data;
    },
    commentOnStory: async (id, comment) => {
        const response = await api.post(`/stories/${id}/comments`, { content: comment });
        return response.data;
    }
};

export default storyService;
