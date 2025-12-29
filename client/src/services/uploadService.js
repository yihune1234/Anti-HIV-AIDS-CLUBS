import api, { BASE_URL } from './api';

const uploadService = {
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getFileUrl: (filePath) => {
        if (!filePath) return '';
        if (filePath.startsWith('http')) return filePath;
        // Clean path to remove leading slash if present to avoid double slashes
        const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        // Check if path includes 'uploads/' already
        if (cleanPath.startsWith('uploads/')) {
            return `${BASE_URL}/${cleanPath}`;
        }
        return `${BASE_URL}/uploads/${cleanPath}`;
    }
};

export default uploadService;
