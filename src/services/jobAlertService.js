import api from './api';

const jobAlertService = {
    createAlert: async (alertData) => {
        const response = await api.post('/job-alerts', alertData);
        return response.data;
    },

    getMyAlerts: async () => {
        const response = await api.get('/job-alerts');
        return response.data;
    },

    deleteAlert: async (alertId) => {
        await api.delete(`/job-alerts/${alertId}`);
    },

    toggleAlert: async (alertId) => {
        const response = await api.patch(`/job-alerts/${alertId}/toggle`);
        return response.data;
    },

    getMatchedJobs: async () => {
        const response = await api.get('/job-alerts/matched');
        return response.data;
    },

    getRecommendedCandidates: async (jobId) => {
        const response = await api.get(`/jobs/${jobId}/recommended-candidates`);
        return response.data;
    }
};

export default jobAlertService;
