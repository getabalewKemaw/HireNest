import api from './api';

const jobService = {
    createJob: async (jobData) => {
        const response = await api.post('/api/v1/jobs', jobData);
        return response.data;
    },

    getJobs: async (filters = {}) => {
        const response = await api.get('/api/v1/jobs', { params: filters });
        return response.data;
    },

    getJob: async (jobId) => {
        const response = await api.get(`/api/v1/jobs/${jobId}`);
        return response.data;
    },

    updateJob: async (jobId, jobData) => {
        const response = await api.put(`/api/v1/jobs/${jobId}`, jobData);
        return response.data;
    },

    deactivateJob: async (jobId) => {
        const response = await api.put(`/api/v1/jobs/${jobId}/deactivate`);
        return response.data;
    },

    getMyJobs: async () => {
        const response = await api.get('/api/v1/jobs/my-jobs');
        return response.data;
    },

    toggleLike: async (jobId) => {
        const response = await api.post(`/api/v1/jobs/${jobId}/like`);
        return response.data;
    },

    hasLiked: async (jobId) => {
        const response = await api.get(`/api/v1/jobs/${jobId}/has-liked`);
        return response.data;
    },

    getLikeCount: async (jobId) => {
        const response = await api.get(`/api/v1/jobs/${jobId}/like-count`);
        return response.data;
    }
};

export default jobService;
