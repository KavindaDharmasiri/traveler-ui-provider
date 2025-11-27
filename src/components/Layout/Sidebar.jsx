import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faQuestionCircle, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white p-6 flex flex-col shadow-lg rounded-r-2xl overflow-y-auto">
      <div className="flex items-center mb-10">
        <div className="w-10 h-10 bg-[#217964] rounded-full flex items-center justify-center mr-3">
          <FontAwesomeIcon icon={faPlane} className="text-white text-xl" />
        </div>
        <span className="text-xl font-semibold text-gray-800">Logo name</span>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-4 border-t border-gray-200 pt-4 mt-4">
            <a
              href="#"
              className="flex items-center text-gray-600 hover:text-[#217964] p-3 rounded-xl hover:bg-[#217964]/10 transition-all duration-200 hover:scale-[1.02]"
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="mr-3" />
              Help
            </a>
          </li>
        </ul>
        <div className="mt-auto">
          <a
            href="#"
            className="flex items-center text-gray-600 hover:text-[#217964] p-3 rounded-xl hover:bg-[#217964]/10 transition-all duration-200 hover:scale-[1.02]"
          >
            <FontAwesomeIcon icon={faRightToBracket} className="mr-3" />
            Log In
          </a>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
