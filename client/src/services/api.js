import axios from 'axios';

export const BASE_URL = 'https://anti-hiv-aids-clubs.onrender.com';

const api = axios.create({
    baseURL: `${BASE_URL}/api`, // Production Render URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optionally redirect to login, but context usually handles state update
        }
        return Promise.reject(error);
    }
);

export default api;
