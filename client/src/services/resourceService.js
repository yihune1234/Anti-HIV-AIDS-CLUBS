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
        const response = await api.post(`/resources/${id}/review`, reviewData);
        return response.data;
    }
};

export default resourceService;
