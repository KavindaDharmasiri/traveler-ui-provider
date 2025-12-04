import React from 'react';
import { X, BellOff, ArrowLeft } from "lucide-react"; 

const NotificationPanel = ({ isOpen, onClose }) => {
  // Mock data for demonstration
  const notifications = [
    { id: 1, message: "Product B-45 sale ends in 3 hours.", time: "5m ago" },
    { id: 2, message: "You have a new message from Support.", time: "1h ago" },
    { id: 3, message: "New voucher 'SUMMER20' is available.", time: "3h ago" },
  ];

  return (
    <>
      {/* 1. Invisible Overlay (Backdrop) */}
      {/* KEY CHANGE: bg-transparent makes it invisible, but it still captures clicks. */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-[99]" 
          onClick={onClose} // This handler closes the panel when clicking anywhere outside it
        ></div>
      )}

      {/* 2. Notification Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-[#217964] text-white z-[100] 
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        // Optional: Add onClick stopPropagation to prevent clicks inside the panel from closing it
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-opacity-20 border-white">
          <h2 className="text-xl font-semibold">Notifications</h2>
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
                  // Retaining the thematic dark green hover
                  className="p-4 border-b border-opacity-10 border-white hover:bg-[#064232] cursor-pointer transition-colors flex justify-between items-start"
                >
                  <div>
                    <p className="text-sm font-medium leading-snug">{notif.message}</p>
                    <p className="text-xs mt-1 opacity-70">{notif.time}</p>
                  </div>
                  <ArrowLeft size={16} className="ml-2 mt-1 opacity-50" />
                </div>
              ))}
            </div>
            {/* Footer/Action */}
            <div className="p-4 border-t border-opacity-20 border-white text-center hover:bg-black opacity-80 transition-opacity">
              <button className="text-sm font-medium">
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