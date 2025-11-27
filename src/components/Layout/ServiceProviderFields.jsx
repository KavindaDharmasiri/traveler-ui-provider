import React from 'react';

const ServiceProviderFields = () => {
  return (
    <>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input type="text" placeholder="Name of the responsible person" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Address Line 1</label>
          <input type="text" placeholder="--" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Address Line 2</label>
          <input type="text" placeholder="--" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Address Line 3</label>
          <input type="text" placeholder="--" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
          <input type="number" placeholder="Ex-: 0712345678" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input type="text" placeholder="Enter a valid email address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input type="text" placeholder="Create a strong password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">City</label>
          <input type="text" placeholder="Nearest City" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">NIC Number/Business Registration</label>
          <input type="text" placeholder="Enter your NIC/Passport/Business registration number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">NIC/Passport/BR Images</label>
          <input type="file" accept="image/*" multiple className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Bank Account Number</label>
          <input type="number" placeholder="Bank account number to receive payments" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Account Holder Name</label>
          <input type="text" placeholder="Account holder's name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Bank</label>
          <input type="text" placeholder="Bank name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
      <div className="space-y-5" data-category="service provider">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Branch</label>
          <input type="text" placeholder="Enter branch of the bank" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" required />
        </div>
      </div>
    </>
  );
};

export default ServiceProviderFields;