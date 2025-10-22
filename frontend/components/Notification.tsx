import React from 'react';
import { useNotifications } from '../context/NotificationContext';

const ICONS = {
    success: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
    ),
    error: (
         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
    ),
    info: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
    )
};

const BG_COLORS = {
    success: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200',
    error: 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200',
    info: 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
};

const Notification: React.FC = () => {
    const { toasts } = useNotifications();

    if (!toasts.length) {
        return null;
    }

    return (
        <div className="fixed bottom-5 right-5 z-50 space-y-3">
            {toasts.map(toast => (
                <div key={toast.id} className={`flex items-center p-4 text-sm rounded-lg shadow-lg ${BG_COLORS[toast.type]}`} role="alert">
                    <div className="mr-3">{ICONS[toast.type]}</div>
                    <span className="font-medium">{toast.message}</span>
                </div>
            ))}
        </div>
    );
};

export default Notification;