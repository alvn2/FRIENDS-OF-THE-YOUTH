import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications, useNotification } from '../context/NotificationContext';

const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
    const icons: { [key: string]: React.ReactNode } = {
        achievement: <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
        event: <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>,
        community: <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg>,
        announcement: <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 00.931-.67l1.712-5.137a1 1 0 011.162-.878A1 1 0 0113 13h2.414l1.553 1.553a1 1 0 001.414-1.414l-4.243-4.243a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 01-1.414 0L9.414 10l3.293-3.293a1 1 0 000-1.414z" clipRule="evenodd" /></svg>,
    };
    return icons[type] || icons['announcement'];
};


const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications } = useNotifications();
  const { markAsRead } = useNotification();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m`;
    return 'now';
};

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-lg shadow-xl z-20 overflow-hidden">
          <div className="p-3 flex justify-between items-center border-b dark:border-gray-700">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && <button onClick={() => markAsRead('all')} className="text-xs text-brand-red hover:underline">Mark all as read</button>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
                notifications.slice(0, 5).map(notif => (
                    <Link key={notif.id} to={notif.link || '#'} onClick={() => { markAsRead(notif.id); setIsOpen(false); }} className={`flex items-start p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${!notif.read ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                        <div className="flex-shrink-0 mr-3 mt-1"><NotificationIcon type={notif.type} /></div>
                        <div className="flex-grow">
                            <p className="text-gray-700 dark:text-gray-300">{notif.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timeAgo(notif.timestamp)}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>}
                    </Link>
                ))
            ) : (
                <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">No notifications yet.</p>
            )}
          </div>
          <Link to="/notifications" onClick={() => setIsOpen(false)} className="block bg-gray-50 dark:bg-gray-900/50 text-center py-2 text-sm font-medium text-brand-red hover:underline">
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
