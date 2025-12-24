import api from './api';

const employerAnalyticsService = {
    getDashboardStats: async () => {
        try {
            const response = await api.get('/api/v1/employer/analytics/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching employer stats:', error);
            throw error;
        }
    }
};

export default employerAnalyticsService;
