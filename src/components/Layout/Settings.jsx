import React from 'react';
// 1. Import the same hook
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const Settings = () => {
  // 2. Create a ref for the element you want to animate
  const settingsRef = React.useRef(null);
  
  // 3. Apply the hook to the ref. 
  // 'true' typically means 'animate on mount' or similar, matching your Orders component usage.
  useScrollAnimation(settingsRef, true);

  return (
    // 4. Attach the ref to the main container element
    <div ref={settingsRef} className="p-6 bg-gray-100 min-h-screen">
      
      {/* 5. Add the 'animate-on-scroll' class to the inner element
          (This class is what your 'useScrollAnimation' hook likely targets to apply the animation) */}
      <div className="bg-white shadow-lg rounded-2xl p-6 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
          Account Settings
        </h2>
        
        {/* Settings Content Goes Here */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-700">Change Theme</h3>
            <p className="text-gray-500">Switch between our light and dark modes.</p>
            {/* Add profile form elements */}
          </div>
          
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-700">Security</h3>
            <p className="text-gray-500">Change your password and set up two-factor authentication.</p>
            {/* Add security options */}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
            <p className="text-gray-500">Manage your email and mobile notification preferences.</p>
            {/* Add notification toggles */}
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            className="bg-[#217964] text-white px-6 py-2 rounded-lg text-base font-medium hover:bg-[#1a5d4e] transition"
            onClick={() => console.log('Settings Saved')}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;