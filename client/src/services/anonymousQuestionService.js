import api from './api';

const anonymousQuestionService = {
    // Public: Create/Ask Question
    askQuestion: async (questionData) => {
        try {
            const response = await api.post('/anonymous-questions', questionData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to submit question';
        }
    },

    // Get all public questions (for public view)
    getPublicQuestions: async () => {
        const response = await api.get('/anonymous-questions');
        return response.data;
    },

    // Admin: GetAll (including pending)
    // Assuming backend endpoint support filtering or separate admin endpoint. 
    // Based on routes: GET /anonymousQuestions (might return all?) or GET /stats
    // Let's assume a specific admin endpoint or query param if needed.
    // routes.js has: router.get('/', anonymousQuestionController.getAllQuestions);
    getAllQuestions: async () => {
        const response = await api.get('/anonymous-questions');
        return response.data;
    },

    // Admin: Get Question Stats
    getQuestionStats: async () => {
        try {
            const response = await api.get('/anonymous-questions/stats');
            return response.data;
        } catch (error) {
            console.warn('Failed to fetch question stats:', error);
            return { data: { totalQuestions: 0, pendingQuestions: 0 } };
        }
    },

    // Admin: Answer Question
    answerQuestion: async (id, answer) => {
        try {
            const response = await api.post(`/anonymous-questions/${id}/answer`, { answer });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to answer question';
        }
    },

    // Admin: Delete Question
    deleteQuestion: async (id) => {
        try {
            const response = await api.delete(`/anonymous-questions/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete question';
        }
    }
};

export default anonymousQuestionService;
