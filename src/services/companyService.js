import api from './api';

const companyService = {
    createProfile: async (profileData) => {
        const response = await api.post('/api/v1/company-profile', profileData);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/api/v1/company-profile/me');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/api/v1/company-profile/me', profileData);
        return response.data;
    },

    uploadLogo: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/api/v1/company-profile/me/logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export default companyService;
