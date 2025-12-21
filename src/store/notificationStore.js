import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useNotificationStore = create(
    persist(
        (set) => ({
            notifications: [
                {
                    id: 'n1',
                    title: 'Welcome to HireNest!',
                    message: 'Complete your profile to start hiring the best talent.',
                    type: 'info',
                    timestamp: new Date().toISOString(),
                    read: false
                }
            ],
            unreadCount: 1,

            addNotification: (notification) => set((state) => {
                const newNotification = {
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date().toISOString(),
                    read: false,
                    ...notification
                };
                const newNotifications = [newNotification, ...state.notifications];
                return {
                    notifications: newNotifications,
                    unreadCount: newNotifications.filter(n => !n.read).length
                };
            }),

            markAsRead: (id) => set((state) => {
                const newNotifications = state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                );
                return {
                    notifications: newNotifications,
                    unreadCount: newNotifications.filter(n => !n.read).length
                };
            }),

            markAllAsRead: () => set((state) => {
                const newNotifications = state.notifications.map(n => ({ ...n, read: true }));
                return {
                    notifications: newNotifications,
                    unreadCount: 0
                };
            }),

            clearNotification: (id) => set((state) => {
                const newNotifications = state.notifications.filter(n => n.id !== id);
                return {
                    notifications: newNotifications,
                    unreadCount: newNotifications.filter(n => !n.read).length
                };
            })
        }),
        {
            name: 'hirenest-notifications',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useNotificationStore;
