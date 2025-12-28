import api from './api';

const verificationService = {
    // Employer endpoints
    submitVerification: async (formData) => {
        return await api.post('/api/v1/employer/verification', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000 // 60s timeout for file upload
        });
    },

    getVerificationStatus: async () => {
        return await api.get('/api/v1/employer/verification/status');
    },

    verifyCode: async (code) => {
        return await api.post('/api/v1/employer/verification/verify-code', { code });
    },

    // Admin endpoints
    getPendingVerifications: async () => {
        return await api.get('/api/v1/admin/company-verifications/pending');
    },

    getVerificationById: async (id) => {
        return await api.get(`/api/v1/admin/company-verifications/${id}`);
    },

    reviewVerification: async (id, action, rejectionReason = '') => {
        return await api.put(`/api/v1/admin/company-verifications/${id}/review`, {
            action,
            rejectionReason,
        });
    },

    getAllVerifications: async () => {
        return await api.get('/api/v1/admin/company-verifications');
    },

    deleteVerification: async (id) => {
        return await api.delete(`/api/v1/admin/company-verifications/${id}`);
    },
};

export default verificationService;
