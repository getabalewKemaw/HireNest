import React, { useEffect, useRef } from 'react';
import { Bell, Check, Clock, X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import useNotificationStore from '../store/notificationStore';
import useAuthStore from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = ({ isOpen, onClose }) => {
    const { user } = useAuthStore();
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        fetchNotifications
    } = useNotificationStore();

    const panelRef = useRef(null);

    useEffect(() => {
        if (isOpen && user?.id) {
            fetchNotifications(user.id);
        }
    }, [isOpen, user?.id, fetchNotifications]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes('approve') || t.includes('hired')) return <CheckCircle size={18} className="text-emerald-500" />;
        if (t.includes('reject')) return <AlertTriangle size={18} className="text-rose-500" />;
        if (t.includes('application')) return <Info size={18} className="text-secondary" />;
        return <Bell size={18} className="text-blue-500" />;
    };

    return (
        <div
            ref={panelRef}
            className="absolute top-16 right-0 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[600px] bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[100] animate-fade-in-up"
            style={{ marginRight: '1rem' }}
        >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <div>
                    <h3 className="text-lg font-serif font-black text-primary dark:text-white">Notifications</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        {unreadCount} UNREAD MESSAGES
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllAsRead(user.id)}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-secondary transition-all"
                            title="Mark all as read"
                        >
                            <Check size={18} />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto max-h-[480px] custom-scrollbar">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent mx-auto"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => !notif.isRead && markAsRead(user.id, notif.id)}
                                className={`p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer relative group ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                            >
                                {!notif.isRead && (
                                    <div className="absolute top-6 right-6 w-2 h-2 bg-secondary rounded-full"></div>
                                )}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        {getIcon(notif.title)}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className={`text-sm font-bold mb-1 ${notif.isRead ? 'text-gray-600 dark:text-gray-300' : 'text-primary dark:text-white'}`}>
                                            {notif.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <Clock size={12} />
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                            <Bell size={32} />
                        </div>
                        <h4 className="text-gray-400 font-serif font-black italic">No notifications yet</h4>
                        <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">Everything is up to date.</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-center">
                <button className="text-[10px] font-black text-secondary hover:text-secondary-dark uppercase tracking-[0.2em] transition-all">
                    View All History
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;
