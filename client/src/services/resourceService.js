import api from './api';

const resourceService = {
    getAllResources: async () => {
        const response = await api.get('/resources');
        return response.data;
    },
    getResourceById: async (id) => {
        const response = await api.get(`/resources/${id}`);
        return response.data;
    },
    downloadResource: async (id) => {
        // Backend endpoint is POST /:id/download and returns JSON with updated stats
        const response = await api.post(`/resources/${id}/download`);
        return response.data;
    },
    addReview: async (id, reviewData) => {
        const response = await api.post(`/resources/${id}/reviews`, reviewData);
        return response.data;
    },

    // Admin Management
    createResource: async (resourceData) => {
        try {
            const response = await api.post('/resources', resourceData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create resource';
        }
    },
    updateResource: async (id, resourceData) => {
        try {
            const response = await api.put(`/resources/${id}`, resourceData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update resource';
        }
    },
    deleteResource: async (id) => {
        try {
            const response = await api.delete(`/resources/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete resource';
        }
    },
    verifyResource: async (id) => {
        try {
            const response = await api.patch(`/resources/${id}/verify`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to verify resource';
        }
    }
};

export default resourceService;
