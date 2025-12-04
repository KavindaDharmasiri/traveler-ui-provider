import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import {
  faEdit,
  faEnvelope,
  faUser,
  faPhone,
  faMapMarkerAlt,
  faCamera,
  faGlobe,
  faMapPin,
  faFlag,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";

const initialUserDetails = {
  firstName: "Layla",
  lastName: "Adam",
  email: "jane.doe@example.com",
  phone: "0771234567",
  addressLine1: "123 Main St",
  addressLine2: "Apt 4B",
  city: "Colombo",
  state: "Western",
  postalCode: "10100",
  country: "Sri Lanka",
  googleMaps: "https://maps.google.com/...",
  profileImage: null,
};

const Profile = () => {
  const contentRef = React.useRef(null);
  useScrollAnimation(contentRef, true);

  const [editing, setEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(initialUserDetails);
  const [editBuffer, setEditBuffer] = useState(initialUserDetails);

  const handleChange = (e) => {
    setEditBuffer({ ...editBuffer, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditBuffer({
        ...editBuffer,
        profileImage: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = () => {
    setUserDetails(editBuffer);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditBuffer(userDetails);
    setEditing(false);
  };

  return (
    <div ref={contentRef} className="max-w-5xl mx-auto p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 animate-on-scroll">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        <FontAwesomeIcon icon={faUser} className="mr-3 text-[#217964]" />
        User Profile
      </h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <img
            src={
              editing
                ? editBuffer.profileImage || "/default-profile.png"
                : userDetails.profileImage || "/default-profile.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
          />

          {editing && (
            <label className="absolute bottom-1 right-1 bg-[#217964] text-white p-2 rounded-full cursor-pointer shadow-md">
              <FontAwesomeIcon icon={faCamera} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="space-y-8">

        {/* Full Name */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faUser} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">Name</p>

            {editing ? (
              <div className="flex gap-4">
                <input
                  name="firstName"
                  value={editBuffer.firstName}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-1/2"
                />
                <input
                  name="lastName"
                  value={editBuffer.lastName}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-1/2"
                />
              </div>
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {userDetails.firstName} {userDetails.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email (read-only) */}
        <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
          <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 mr-4 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-500">Email Address (Read Only)</p>
            <p className="text-lg font-mono text-gray-900">{userDetails.email}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faPhone} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">Phone Number</p>

            {editing ? (
              <input
                name="phone"
                value={editBuffer.phone}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.phone}</p>
            )}
          </div>
        </div>

        {/* Address Line 1 */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faMapPin} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">Address Line 1</p>

            {editing ? (
              <input
                name="addressLine1"
                value={editBuffer.addressLine1}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.addressLine1}</p>
            )}
          </div>
        </div>

        {/* Address Line 2 */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faMapPin} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">Address Line 2 (optional)</p>

            {editing ? (
              <input
                name="addressLine2"
                value={editBuffer.addressLine2}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">
                {userDetails.addressLine2 || "—"}
              </p>
            )}
          </div>
        </div>

        {/* City */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">City</p>

            {editing ? (
              <input
                name="city"
                value={editBuffer.city}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.city}</p>
            )}
          </div>
        </div>

        {/* State / Province */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faFlag} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">State / Province</p>

            {editing ? (
              <input
                name="state"
                value={editBuffer.state}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.state}</p>
            )}
          </div>
        </div>

        {/* Postal Code */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faMapPin} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">Postal Code</p>

            {editing ? (
              <input
                name="postalCode"
                value={editBuffer.postalCode}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.postalCode}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faGlobe} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">Country</p>

            {editing ? (
              <input
                name="country"
                value={editBuffer.country}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.country}</p>
            )}
          </div>
        </div>

        {/* Google Maps Link */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faLocationArrow} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">Google Maps Location Link</p>

            {editing ? (
              <input
                name="googleMaps"
                value={editBuffer.googleMaps}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
            ) : (
              <a
                href={userDetails.googleMaps}
                target="_blank"
                className="text-lg text-blue-600 underline"
              >
                View Location
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex gap-4">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl shadow-sm text-white bg-[#217964] hover:bg-green-700 transition"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit Details
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-[#217964] text-white rounded-xl shadow hover:bg-green-700"
            >
              Save
            </button>

            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-xl shadow hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default Profile;
