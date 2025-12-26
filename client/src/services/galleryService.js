import api from './api';

const galleryService = {
    getAllGalleryItems: async () => {
        const response = await api.get('/gallery');
        return response.data;
    },
    getGalleryItemById: async (id) => {
        const response = await api.get(`/gallery/${id}`);
        return response.data;
    },
    likeGalleryItem: async (id) => {
        const response = await api.post(`/gallery/${id}/like`);
        return response.data;
    },
    commentOnGalleryItem: async (id, text) => {
        const response = await api.post(`/gallery/${id}/comments`, { content: text });
        return response.data;
    },

    // Admin: Create Gallery Item (Upload)
    createGalleryItem: async (galleryData) => {
        try {
            const response = await api.post('/gallery', galleryData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to upload image';
        }
    },

    // Admin: Delete Gallery Item
    deleteGalleryItem: async (id) => {
        try {
            const response = await api.delete(`/gallery/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete image';
        }
    }
};

export default galleryService;
