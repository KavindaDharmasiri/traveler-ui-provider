import React from "react";
import { navItems } from "../../constants/navItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../utils/authService";
import TravelerLogo from "./TravlerLogo";
import { 
  faPlane,
  faQuestionCircle,
  faCog,
  faSignOutAlt,
  faThLarge,
  faShoppingCart,
  faBoxOpen,
  faSquarePlus,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  // Map your navItems icon names to Font Awesome icons
  "fa-th-large": faThLarge,
  "fa-shopping-cart": faShoppingCart,
  "fa-box-open": faBoxOpen,
  "fa-square-plus": faSquarePlus,
  "fa-user-circle": faUserCircle,
  // Add more if needed
};

const Sidebar = ({ currentPage, setCurrentPage, isMobileOpen, setIsMobileOpen }) => {
  const logoFillColor = '#217964'; // Use the primary green color
  const isScrolled = false; // Sidebar logo is always "at the top" state
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 **bg-gray-100** p-6 flex flex-col shadow-lg rounded-r-2xl 
        transition-transform duration-300 ease-in-out 
        overflow-y-auto
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex items-center mb-10 w-full justify-start">
      {/* Increased size (h-14 w-56 from h-12 w-48) and margin-left (ml-4 from ml-2) */}
      <div className="h-18 w-72 flex items-center justify-start -ml-6">
        <TravelerLogo
          logoFillColor={logoFillColor}
          isScrolled={isScrolled}
        />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <li key={item.page} className="mb-4">
                <button
                  onClick={() => {
                    setCurrentPage(item.page);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    flex items-center w-full text-left p-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? "text-[#217964] font-medium bg-[#217964]/10 scale-[1.02]"
                      : "text-gray-600 hover:text-[#217964] hover:bg-[#217964]/10 hover:scale-[1.02]"
                    }
                  `}
                >
                  {iconMap[item.icon] && (
                    <FontAwesomeIcon icon={iconMap[item.icon]} className="mr-3" />
                  )}
                  {item.name}
                </button>
              </li>
            );
          })}

          {/* Divider */}
          <li className="mb-4 border-t border-gray-200 pt-4 mt-4">
            <button className="flex items-center w-full text-left p-3 rounded-xl text-gray-600 hover:text-[#217964] hover:bg-[#217964]/10 transition-all hover:scale-[1.02]">
              <FontAwesomeIcon icon={faQuestionCircle} className="mr-3" />
              Help
            </button>
          </li>

          <li className="mb-4">
            <button className="flex items-center w-full text-left p-3 rounded-xl text-gray-600 hover:text-[#217964] hover:bg-[#217964]/10 transition-all hover:scale-[1.02]">
              <FontAwesomeIcon icon={faCog} className="mr-3" />
              Setting
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button 
          onClick={logout}
          className="flex items-center w-full text-left p-3 rounded-xl text-gray-600 hover:text-[#217964] hover:bg-[#217964]/10 hover:scale-[1.02] transition-all"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
