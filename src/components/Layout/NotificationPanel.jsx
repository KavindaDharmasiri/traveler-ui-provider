import React, { useContext, useEffect } from 'react';
import { X, BellOff } from "lucide-react"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import NotificationContext from '../context/NotificationContext.jsx';
import { notificationService } from '../../api/notificationService';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, setNotifications, fetchNotifications, unreadCount } = useContext(NotificationContext);

  const handleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prevNotifs => 
        prevNotifs.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(
        unreadNotifications.map(notif => notificationService.markAsRead(notif.id))
      );
      setNotifications(prevNotifs => 
        prevNotifs.map(notif => ({ ...notif, isRead: true }))
      );
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };
  


  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-[99]" 
          onClick={onClose} 
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white text-gray-800 z-[100] 
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-xl font-semibold">Notifications ({unreadNotifications.length})</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close notifications"
          >
            <X size={24} />
          </button>
        </div>

        {notifications.length > 0 ? (
          <div className="flex flex-col h-[calc(100%-60px)]">
            <div className="flex-1 overflow-y-auto">
              {unreadNotifications.length > 0 && (
                <div className="px-4 py-2 bg-gray-100 sticky top-0 z-10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">New Notifications</p>
                </div>
              )}
              {unreadNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleRead(notif.id)}
                  className="p-4 border-b border-gray-200 cursor-pointer transition-colors flex justify-between items-center bg-emerald-50 hover:bg-emerald-100"
                >
                  <div className='flex-1'>
                    <p className="text-sm font-semibold leading-snug text-gray-800">{notif.message}</p>
                    <p className="text-xs mt-1 text-gray-600">{notif.time}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRead(notif.id);
                    }}
                    className="ml-2 p-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex-shrink-0"
                    aria-label="Mark as read"
                  >
                    <FontAwesomeIcon icon={faCheck} size="sm" />
                  </button>
                </div>
              ))}
              
              {readNotifications.length > 0 && (
                <div className="px-4 py-2 bg-gray-100 sticky top-0 z-10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">Earlier</p>
                </div>
              )}
              {readNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className='flex-1'>
                    <p className="text-sm font-normal leading-snug text-gray-700">{notif.message}</p>
                    <p className="text-xs mt-1 text-gray-500">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 text-center transition-colors">
              <button 
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:text-gray-400"
                onClick={handleMarkAllRead}
                disabled={unreadNotifications.length === 0}
              >
                Mark all as read
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 pt-16 text-center text-gray-500">
            <BellOff className="mx-auto mb-4" size={40} />
            <p className="text-sm">You are all caught up!</p>
            <p className="text-xs mt-1">No new notifications.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
