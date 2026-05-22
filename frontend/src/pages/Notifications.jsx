import React, { useState, useEffect } from 'react';
import dataService from '../api/data';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await dataService.getNotifications();
      setNotifications(response.results || response);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      like: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
      event: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      comment: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      follow: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      system: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[type] || icons.system;
  };

  const getColorClass = (type) => {
    const colors = {
      like: 'bg-[#0081C9]',
      event: 'bg-[#FF9F29]',
      comment: 'bg-[#7C73C0]',
      follow: 'bg-[#D2DAFF]',
      system: 'bg-[#6B7280]',
    };
    return colors[type] || colors.system;
  };

  const handleMarkRead = async (id) => {
    try {
      await dataService.markNotificationRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="space-y-3">
          <h1 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight">Notifications</h1>
          <p className="text-gray-400 font-medium text-lg italic">
            Stay updated on your travel interactions and local events.
          </p>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {loading && <div className="text-center py-12 text-gray-500">Loading notifications...</div>}
          {error && <div className="text-center py-12 text-red-500">{error}</div>}
          {!loading && notifications.length === 0 && <div className="text-center py-12 text-gray-500">No notifications yet</div>}
          
          {!loading && notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => !notif.is_read && handleMarkRead(notif.id)}
              className={`bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-8 transition-all hover:shadow-md group cursor-pointer ${
                !notif.is_read ? 'border-l-[6px] border-l-[#0081C9]' : ''
              }`}
            >
              <div className={`${getColorClass(notif.type)} w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg shrink-0 transform group-hover:scale-110 transition-transform`}>
                {getNotificationIcon(notif.type)}
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="text-[#0F4C81] text-lg font-medium leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-gray-400 text-sm font-bold block italic">{new Date(notif.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
