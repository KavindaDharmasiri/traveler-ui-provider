import React, { useState, useEffect,useContext } from "react";
import { Menu, X } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCommentDots, faSearch } from '@fortawesome/free-solid-svg-icons';
import NotificationPanel from "./NotificationPanel"; // Import the new component
import NotificationContext from '../context/NotificationContext.jsx';
import axiosInstance from '../../api/axiosInstance';

const initialNotifications = [
  { id: 1, message: "Product B-45 sale ends in 3 hours.", time: "5m ago", isRead: false },
  { id: 2, message: "You have a new message from Support.", time: "1h ago", isRead: false },
  { id: 3, message: "New voucher 'SUMMER20' is available.", time: "3h ago", isRead: true }, // Example of a read one
];

const Header = ({ isSidebarOpen, setIsSidebarOpen  }) => {

  const { notifications, unreadCount } = useContext(NotificationContext);

  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState(null);
  // State for the notification panel
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); 

  useEffect(() => {
    // Initial fetch
    fetchUserProfile();
    
    // Set up interval to fetch every 30 seconds
    const interval = setInterval(fetchUserProfile, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('auth/me');
      const userData = response.data;
      
      if (userData.name) {
        setUserName(userData.name);
        // Also update localStorage for backward compatibility
        localStorage.setItem('name', userData.name);
      }
      
      // Fetch profile image if UUID exists
      if (userData.profileImageUuid) {
        fetchProfileImage(userData.profileImageUuid);
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to localStorage
      const name = localStorage.getItem("name");
      if (name) {
        setUserName(name);
      }
    }
  };

  const fetchProfileImage = async (imageUuid) => {
    try {
      const response = await axiosInstance.get(`storage/files/download/${imageUuid}`, {
        responseType: 'blob'
      });
      const imageUrl = URL.createObjectURL(response.data);
      setProfileImage(imageUrl);
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setProfileImage(null);
    }
  };

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
          <div className="relative">
            <button 
              className="text-gray-500 hover:text-[#217964] p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
              onClick={toggleNotificationPanel}
              aria-label="Toggle notifications"
            >
              <FontAwesomeIcon icon={faBell} className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">{unreadCount}</span>
              )}
            </button>
          </div>
              
          <button className="text-gray-500 hover:text-[#217964] p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110">
            <FontAwesomeIcon icon={faCommentDots} className="text-xl" />
          </button>

          <div className="flex items-center space-x-2">
            <img
              src={profileImage || getAvatarUrl(userName)}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.src = getAvatarUrl(userName);
              }}
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