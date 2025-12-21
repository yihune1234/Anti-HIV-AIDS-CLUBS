import api from './api';

const userService = {
    // Admin: Get all users
    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch users';
        }
    },

    // Admin: Get user stats
    getUserStats: async () => {
        try {
            const response = await api.get('/users/stats');
            return response.data;
        } catch (error) {
            console.warn('Failed to fetch user stats:', error);
            return { data: { totalUsers: 0 } }; // Fallback
        }
    },

    // Admin: Update user role
    updateUserRole: async (userId, role) => {
        try {
            const response = await api.put(`/users/${userId}/role`, { role });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update user role';
        }
    },

    // Admin: Toggle user active status
    toggleUserStatus: async (userId) => {
        try {
            const response = await api.patch(`/users/${userId}/toggle-status`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update user status';
        }
    },

    // Admin: Delete user
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete user';
        }
    }
};

export default userService;
