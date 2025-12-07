import React, { useState } from 'react';
import { X, BellOff, Check } from "lucide-react"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Assuming you use FA icons elsewhere
import { faCheck } from '@fortawesome/free-solid-svg-icons'; // Import the solid check icon

// Initial data, now with a default 'read' status
const initialNotifications = [
  { id: 1, message: "Product B-45 sale ends in 3 hours.", time: "5m ago", isRead: false },
  { id: 2, message: "You have a new message from Support.", time: "1h ago", isRead: false },
  { id: 3, message: "New voucher 'SUMMER20' is available.", time: "3h ago", isRead: true }, // Example of a read one
];

const NotificationPanel = ({ isOpen, onClose, setUnreadCount }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  // Function to mark a single notification as read
  const handleRead = (id) => {
    setNotifications(prevNotifs => 
      prevNotifs.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Function to mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications(prevNotifs => 
      prevNotifs.map(notif => ({ ...notif, isRead: true }))
    );
  };
  
  // Calculate and update the unread count in the parent (Header)
  React.useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    if (setUnreadCount) {
      setUnreadCount(unread);
    }
  }, [notifications, setUnreadCount]);


  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <>
      {/* 1. Invisible Overlay (Backdrop) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-[99]" 
          onClick={onClose} 
        ></div>
      )}

      {/* 2. Notification Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-[#217964] text-white z-[100] 
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-opacity-20 border-white">
          <h2 className="text-xl font-semibold">Notifications ({unreadNotifications.length})</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-black hover:bg-opacity-80 transition-colors"
            aria-label="Close notifications"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {notifications.length > 0 ? (
          <div className="flex flex-col h-[calc(100%-60px)]">
            <div className="flex-1 overflow-y-auto">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 border-b border-opacity-10 border-white cursor-pointer transition-colors flex justify-between items-center
                    ${notif.isRead ? 'opacity-80 hover:bg-black/10' : 'hover:bg-[#175D4E]'} `} // Dim read items
                >
                  <div className='flex-1'>
                    <p className={`text-sm font-medium leading-snug ${notif.isRead ? 'font-normal' : 'font-semibold'}`}>{notif.message}</p>
                    <p className="text-xs mt-1 opacity-70">{notif.time}</p>
                  </div>
                  
                  {/* Mark as Read Button (Tick) */}
                  {!notif.isRead && (
                    <button
                      onClick={() => handleRead(notif.id)}
                      className="ml-2 p-1 rounded-full bg-[#FFFFFF] text-black hover:bg-[#000000] hover:text-white transition-colors flex-shrink-0"
                      aria-label="Mark as read"
                    >
                      <FontAwesomeIcon icon={faCheck} size="sm" />
                    </button>
                  )}

                </div>
              ))}
            </div>
            
            {/* Footer/Action */}
            <div className="p-4 border-t border-opacity-20 border-white text-center transition-colors">
              <button 
                className="text-sm font-medium hover:opacity-80 disabled:opacity-50"
                onClick={handleMarkAllRead}
                disabled={unreadNotifications.length === 0}
              >
                Mark all as read
              </button>
            </div>
          </div>
        ) : (
          // Empty state
          <div className="p-8 pt-16 text-center opacity-80">
            <BellOff className="mx-auto mb-4" size={40} />
            <p className="text-sm">You are all caught up!</p>
            <p className="text-xs mt-1 opacity-75">No new notifications.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;