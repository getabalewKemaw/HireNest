import api from './api';

const adminAnalyticsService = {
    getDashboardStats: async () => {
        try {
            const response = await api.get('/api/v1/admin/analytics/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            throw error;
        }
    }
};

export default adminAnalyticsService;
