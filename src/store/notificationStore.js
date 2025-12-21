import { create } from 'zustand';
import notificationService from '../services/notificationService';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    fetchNotifications: async (userId) => {
        if (!userId) return;
        set({ loading: true });
        try {
            const data = await notificationService.getNotifications(userId);
            set({
                notifications: data.content,
                unreadCount: data.content.filter(n => !n.isRead).length,
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchUnreadCount: async (userId) => {
        if (!userId) return;
        try {
            const count = await notificationService.getUnreadCount(userId);
            set({ unreadCount: count });
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    },

    markAsRead: async (userId, notificationId) => {
        try {
            await notificationService.markAsRead(userId, notificationId);
            set((state) => {
                const newNotifications = state.notifications.map(n =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                );
                return {
                    notifications: newNotifications,
                    unreadCount: Math.max(0, state.unreadCount - 1)
                };
            });
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    },

    markAllAsRead: async (userId) => {
        try {
            await notificationService.markAllAsRead(userId);
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    },

    addLocalNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1
    }))
}));

export default useNotificationStore;
