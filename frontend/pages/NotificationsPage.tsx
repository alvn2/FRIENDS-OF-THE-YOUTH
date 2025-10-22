import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications, useNotification } from '../context/NotificationContext';
import { Notification } from '../types';

const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
    const icons: { [key: string]: React.ReactNode } = {
        achievement: <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center"><svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>,
        event: <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg></div>,
        community: <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg></div>,
        announcement: <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"><svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 00.931-.67l1.712-5.137a1 1 0 011.162-.878A1 1 0 0113 13h2.414l1.553 1.553a1 1 0 001.414-1.414l-4.243-4.243a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 01-1.414 0L9.414 10l3.293-3.293a1 1 0 000-1.414z" clipRule="evenodd" /></svg></div>,
    };
    return icons[type] || icons['announcement'];
};


const NotificationItem: React.FC<{ notif: Notification }> = ({ notif }) => {
    const { markAsRead } = useNotification();
    
    return (
        <div className={`p-4 flex items-start gap-4 border-b dark:border-gray-700 ${!notif.read ? 'bg-white dark:bg-dark-card' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
            <NotificationIcon type={notif.type} />
            <div className="flex-grow">
                <p className="text-sm text-gray-800 dark:text-gray-200">{notif.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notif.timestamp).toLocaleString()}
                </p>
                {notif.link && (
                    <Link to={notif.link} className="text-sm font-semibold text-brand-primary hover:underline mt-2 inline-block">View Details</Link>
                )}
            </div>
            {!notif.read && (
                <button onClick={() => markAsRead(notif.id)} className="text-xs font-medium text-blue-600 hover:underline" title="Mark as read">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </button>
            )}
        </div>
    );
};

const NotificationsPage: React.FC = () => {
    const { notifications } = useNotifications();
    const { markAllAsRead } = useNotification();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = useMemo(() => {
        if (filter === 'unread') {
            return notifications.filter(n => !n.read);
        }
        return notifications;
    }, [notifications, filter]);

    const hasUnread = notifications.some(n => !n.read);
    const getTabClass = (tabName: string) => 
        `px-4 py-2 text-sm font-medium rounded-md ${filter === tabName ? 'bg-brand-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Notifications</h1>
                {hasUnread && <button onClick={markAllAsRead} className="text-sm font-medium text-brand-primary hover:underline">Mark all as read</button>}
            </div>
            
            <div className="mb-4 flex items-center gap-2 p-2 bg-gray-100 dark:bg-dark-card rounded-lg">
                <button onClick={() => setFilter('all')} className={getTabClass('all')}>All</button>
                <button onClick={() => setFilter('unread')} className={getTabClass('unread')}>Unread</button>
            </div>
            
            <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-hidden">
                {filteredNotifications.length > 0 ? (
                    <div className="divide-y dark:divide-gray-700">
                        {filteredNotifications.map(notif => (
                            <NotificationItem key={notif.id} notif={notif} />
                        ))}
                    </div>
                ) : (
                    <p className="p-8 text-center text-gray-500 dark:text-gray-400">
                        {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
