import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCommentDots, faSearch } from '@fortawesome/free-solid-svg-icons';
import NotificationPanel from "./NotificationPanel"; // Import the new component

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [userName, setUserName] = useState("User");
  // State for the notification panel
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); 

  useEffect(() => {
    const checkName = () => {
      const name = localStorage.getItem("name");
      if (name) {
        setUserName(name);
      }
    };

    checkName();
    const interval = setInterval(checkName, 500);
    
    return () => clearInterval(interval);
  }, []);

  const getAvatarUrl = (name) => {
    if (!name) return 'https://placehold.co/40x40/FF7F50/FFFFFF?text=U';
    const words = name.trim().split(' ');
    const initials = words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0][0];
    return `https://placehold.co/40x40/FF7F50/FFFFFF?text=${initials.toUpperCase()}`;
  };

  // Handler to toggle the notification panel
  const toggleNotificationPanel = () => {
    setIsNotificationOpen(prev => !prev);
  };

  return (
    <>
      {/* Render the separate Notification Panel component */}
      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={toggleNotificationPanel} 
      />

      {/* Main Header Content */}
      <header className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md mb-6 relative z-30"> 
        {/* Search */}
        <div className="relative flex-1 max-w-md mx-auto lg:mx-0">
          <input
            type="text"
            placeholder="Search products, vouchers, price..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#217964] transition-all duration-200"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4 ml-auto">
          <button
            className="text-gray-500 hover:text-[#217964] p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Notification Button calls the toggle handler */}
          <button 
            className="text-gray-500 hover:text-[#217964] p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
            onClick={toggleNotificationPanel}
            aria-label="Toggle notifications"
          >
            <FontAwesomeIcon icon={faBell} className="text-xl" />
          </button>

          <button className="text-gray-500 hover:text-[#217964] p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110">
            <FontAwesomeIcon icon={faCommentDots} className="text-xl" />
          </button>

          <div className="flex items-center space-x-2">
            <img
              src={getAvatarUrl(userName)}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">Provider</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;