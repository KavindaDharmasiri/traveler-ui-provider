import React from 'react';

const TravellerFields = () => {
  return (
    <>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input type="text" placeholder="Enter name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Address Line 1</label>
          <input type="text" placeholder="--" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Address Line 2</label>
          <input type="text" placeholder="--" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Address Line 3</label>
          <input type="text" placeholder="--" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-6" data-category="traveller">
        <label className="block text-gray-700 font-semibold mb-2">Gender</label>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input type="radio" name="gender" value="male" className="w-5 h-5 text-[#217964] border-gray-300 focus:ring-[#217964]" required />
            <span className="text-gray-700">Male</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="gender" value="female" className="w-5 h-5 text-[#217964] border-gray-300 focus:ring-[#217964]" />
            <span className="text-gray-700">Female</span>
          </label>
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
          <input type="number" placeholder="Ex-: 0712345678" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input type="text" placeholder="Enter a valid email address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input type="text" placeholder="Create a strong password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">City</label>
          <input type="text" placeholder="Nearest City" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">NIC Number</label>
          <input type="text" placeholder="Enter your NIC or Passport number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="traveller">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">NIC Images</label>
          <input type="file" accept="image/*" multiple className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
    </>
  );
};

export default TravellerFields;