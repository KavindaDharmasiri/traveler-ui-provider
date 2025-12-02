import React from "react";
import { navItems } from "../../constants/navItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../utils/authService";
import { 
  faPlane,
  faQuestionCircle,
  faCog,
  faSignOutAlt,
  faThLarge,
  faShoppingCart,
  faBoxOpen,
  faSquarePlus
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  // Map your navItems icon names to Font Awesome icons
  "fa-th-large": faThLarge,
  "fa-shopping-cart": faShoppingCart,
  "fa-box-open": faBoxOpen,
  "fa-square-plus": faSquarePlus,
  // Add more if needed
};

const Sidebar = ({ currentPage, setCurrentPage, isMobileOpen, setIsMobileOpen }) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 flex flex-col shadow-lg rounded-r-2xl 
        transition-transform duration-300 ease-in-out 
        overflow-y-auto
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex items-center mb-10">
        <div className="w-10 h-10 bg-[#217964] rounded-full flex items-center justify-center mr-3">
          <FontAwesomeIcon icon={faPlane} className="text-white text-xl" />
        </div>
        <span className="text-xl font-semibold text-gray-800">Logo name</span>
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
