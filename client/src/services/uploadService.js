import api, { BASE_URL } from './api';

const uploadService = {
    uploadFile: async (file) => {
        try {
            // First try the regular upload
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.warn('Regular upload failed, trying direct upload:', error.message);
            
            // If regular upload fails, try direct upload
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await api.post('/upload/direct', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                return response.data;
            } catch (directError) {
                console.error('Both upload methods failed:', directError);
                throw directError;
            }
        }
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
