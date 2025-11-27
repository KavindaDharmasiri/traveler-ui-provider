import React from 'react';
import TravellerFields from './TravellerFields';
import ServiceProviderFields from './ServiceProviderFields';

const NewUserRegistration = ({ selectedCategory, onCategoryChange, onSubmit }) => {
  return (
    <section className="bg-white p-8 rounded-2xl shadow-lg w-full">
      <h2 className="text-2xl font-bold text-[#217964] mb-6 text-center">New User Registration</h2>

      <form className="space-y-5" onSubmit={onSubmit}>
        {/* Category Selection */}
        <div>
          <label htmlFor="categorySelect" className="block text-gray-700 font-semibold mb-2">Category</label>
          <select 
            id="categorySelect" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217964] focus:outline-none" 
            value={selectedCategory}
            onChange={onCategoryChange}
            required
          >
            <option value="">Select category</option>
            <option value="traveller">Traveller</option>
            <option value="service provider">Service Provider</option>
          </select>
        </div>

        {/* Conditional Fields */}
        {selectedCategory === 'traveller' && <TravellerFields />}
        {selectedCategory === 'service provider' && <ServiceProviderFields />}

        {/* Submit Button */}
        {selectedCategory && (
            <div className="text-center pt-5">
                <button 
                    type="submit" 
                    className="w-full bg-[#217964] text-white py-3 px-6 rounded-xl shadow-md hover:bg-[#1a5d4e] transition font-bold"
                >
                    Register
                </button>
            </div>
        )}
        
      </form>
    </section>
  );
};

export default NewUserRegistration;