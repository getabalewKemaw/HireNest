import api from './api';

const applicationService = {
    applyForJob: async (applicationData) => {
        const response = await api.post('/api/v1/applications', applicationData);
        return response.data;
    },

    getApplicationsByJob: async (jobId, pageable = { size: 20 }) => {
        const response = await api.get(`/api/v1/applications/job/${jobId}`, { params: pageable });
        return response.data;
    },

    getMyApplications: async (pageable = { size: 20 }) => {
        const response = await api.get('/api/v1/applications/my-applications', { params: pageable });
        return response.data;
    },

    getApplication: async (applicationId) => {
        const response = await api.get(`/api/v1/applications/${applicationId}`);
        return response.data;
    },

    updateStatus: async (applicationId, updateData) => {
        const response = await api.put(`/api/v1/applications/${applicationId}`, updateData);
        return response.data;
    },

    checkApplication: async (jobId) => {
        const response = await api.get('/api/v1/applications/check', { params: { jobId } });
        return response.data;
    }
};

export default applicationService;
