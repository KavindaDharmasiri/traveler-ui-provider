import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCommentDots, faCircleUser } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md mb-6 animate-on-scroll is-visible">
      <div className="flex items-center space-x-4 ml-auto">
        <button className="text-gray-500 hover:text-[#217964] p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110">
          <FontAwesomeIcon icon={faBell} className="text-xl" />
        </button>
        <button className="text-gray-500 hover:text-[#217964] p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110">
          <FontAwesomeIcon icon={faCommentDots} className="text-xl" />
        </button>
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faCircleUser} className="text-xl" />
          <div>
            <p className="text-sm font-medium text-gray-800">New User</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
