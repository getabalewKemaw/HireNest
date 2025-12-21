import api from './api';

const notificationService = {
    getNotifications: async (userId, page = 0, size = 20) => {
        const response = await api.get(`/api/v1/notifications/${userId}`, {
            params: { page, size }
        });
        return response.data;
    },

    getUnreadCount: async (userId) => {
        const response = await api.get(`/api/v1/notifications/${userId}/unread-count`);
        return response.data.count;
    },

    markAsRead: async (userId, notificationId) => {
        const response = await api.put(`/api/v1/notifications/${userId}/${notificationId}/read`);
        return response.data;
    },

    markAllAsRead: async (userId) => {
        const response = await api.put(`/api/v1/notifications/${userId}/mark-all-read`);
        return response.data;
    }
};

export default notificationService;
