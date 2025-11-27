import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faDollarSign,
  faTag,
  faPhone,
  faMapMarkerAlt,
  faUsers,
  faCar,
  faBed
} from "@fortawesome/free-solid-svg-icons";
import { useScrollAnimation } from "../hooks/useScrollAnimation"; // NEW

const AddItem = () => {
  const [category, setCategory] = useState("");

  // ⭐ NEW scroll animation setup
  const contentRef = useRef(null);
  useScrollAnimation(contentRef, true);

  return (
    <div
      ref={contentRef}
      className="p-6 md:p-10 max-w-4xl mx-auto overflow-hidden"
    >
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-on-scroll opacity-0 translate-y-4">
        Add New Listing
      </h1>

      {/* Category Selection */}
      <div className="animate-on-scroll opacity-0 translate-y-4">
        <label className="block text-gray-700 font-medium mb-2">
          Select Category
        </label>
        <select
          className="w-full p-3 border rounded-lg mb-6"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">-- Choose --</option>
          <option value="camping">Camping Gear</option>
          <option value="electronics">Electronics</option>
          <option value="luggage">Luggage</option>
          <option value="watersports">Water Sports</option>
          <option value="outdoor">Outdoor Apparel</option>
          <option value="vehicles">Vehicles</option>
          <option value="hotels">Hotels</option>
        </select>
      </div>

      {/* Common Fields */}
      <div className="space-y-4 animate-on-scroll opacity-0 translate-y-4">
        <div>
          <label className="block mb-1 font-medium">Listing Name</label>
          <input className="w-full p-3 border rounded-lg" type="text" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price per Day</label>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faDollarSign} />
            <input className="w-full p-3 border rounded-lg" type="number" />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact Number</label>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPhone} />
            <input className="w-full p-3 border rounded-lg" type="text" />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Images</label>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCamera} />
            <input type="file" multiple />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea className="w-full p-3 border rounded-lg" rows="4"></textarea>
        </div>
      </div>

      {/* VEHICLES SECTION */}
      {category === "vehicles" && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl space-y-4 border animate-on-scroll opacity-0 translate-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faCar} /> Vehicle Details
          </h2>

          <input
            className="w-full p-3 border rounded-lg"
            placeholder="Vehicle Number"
          />

          <input
            className="w-full p-3 border rounded-lg"
            type="number"
            placeholder="Passenger Count"
          />

          <select className="w-full p-3 border rounded-lg">
            <option value="ac">AC</option>
            <option value="non-ac">Non-AC</option>
          </select>

          <input
            className="w-full p-3 border rounded-lg"
            type="number"
            placeholder="KM Per Day"
          />

          <input
            className="w-full p-3 border rounded-lg"
            type="number"
            placeholder="Price Per Extra KM"
          />

          <label className="block font-medium">Driver Availability</label>
          <select className="w-full p-3 border rounded-lg">
            <option>With Driver</option>
            <option>Without Driver</option>
            <option>Both Options</option>
          </select>

          <input
            className="w-full p-3 border rounded-lg"
            type="number"
            placeholder="Waiting Charge Per Night"
          />
        </div>
      )}

      {/* HOTELS SECTION */}
      {category === "hotels" && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl space-y-4 border animate-on-scroll opacity-0 translate-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faBed} /> Hotel Details
          </h2>

          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <input
              className="w-full p-3 border rounded-lg"
              placeholder="Address"
            />
          </div>

          <input
            className="w-full p-3 border rounded-lg"
            placeholder="Room Number"
          />

          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} />
            <input
              className="w-full p-3 border rounded-lg"
              type="number"
              placeholder="Max Guests"
            />
          </div>
        </div>
      )}

      <button className="mt-10 w-full bg-[#217964] text-white p-3 rounded-lg text-lg font-semibold hover:bg-[#1a5d4e] transition animate-on-scroll opacity-0 translate-y-4">
        Submit Listing
      </button>
    </div>
  );
};

export default AddItem;
