import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import axiosInstance from "../api/axiosInstance";
import Swal from "sweetalert2";
import PinInput from "../components/common/PinInput";
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
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const initialUserDetails = {
  name: "",
  email: "",
  contactNumber: "",
  address: {
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: ""
  },
  country: "",
  googleMapsUrl: "",
  profileImageUuid: null,
};

const Profile = () => {
  const contentRef = React.useRef(null);

  const [editing, setEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(initialUserDetails);
  const [editBuffer, setEditBuffer] = useState(initialUserDetails);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [showEmailPinInput, setShowEmailPinInput] = useState(false);
  const [showPhonePinInput, setShowPhonePinInput] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('auth/me');
      const userData = response.data;
      
      // Transform API data to match component structure
      const transformedData = {
        name: userData.name || "",
        email: userData.email || "",
        contactNumber: userData.contactNumber || "",
        isEmailVerified: userData.isEmailVerified === true,
        isNumberVerified: userData.isNumberVerified === true,
        address: userData.address || {
          street1: "",
          street2: "",
          city: "",
          state: "",
          postalCode: ""
        },
        country: userData.country || "",
        googleMapsUrl: userData.googleMapsUrl || "",
        profileImageUuid: userData.profileImageUuid || null,
      };
      
      setUserDetails(transformedData);
      setEditBuffer(transformedData);
      
      // Fetch profile image if UUID exists
      if (userData.profileImageUuid) {
        fetchProfileImage(userData.profileImageUuid);
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileImage = async (imageUuid) => {
    try {
      const response = await axiosInstance.get(`storage/files/download/${imageUuid}`, {
        responseType: 'blob'
      });
      const imageUrl = URL.createObjectURL(response.data);
      setProfileImage(imageUrl);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditBuffer({
        ...editBuffer,
        address: {
          ...editBuffer.address,
          [addressField]: value
        }
      });
    } else {
      setEditBuffer({ ...editBuffer, [name]: value });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload to storage service
        const uploadResponse = await axiosInstance.post('storage/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        const imageUuid = uploadResponse.data;
        
        // Update profile with new image UUID
        await axiosInstance.put('auth/profile', {
          tenantId: localStorage.getItem('tenantId'),
          profileImageUuid: imageUuid
        });
        
        // Fetch and display the new image
        fetchProfileImage(imageUuid);
        
        // Update local state
        setUserDetails({
          ...userDetails,
          profileImageUuid: imageUuid
        });
        
      } catch (error) {
        console.error('Error uploading image:', error);
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Failed to upload image. Please try again.',
          confirmButtonColor: '#217964'
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put('auth/profile', {
        tenantId: localStorage.getItem('tenantId'),
        name: editBuffer.name,
        contactNumber: editBuffer.contactNumber,
        address: editBuffer.address,
        country: editBuffer.country,
        googleMapsUrl: editBuffer.googleMapsUrl
      });
      
      setUserDetails(editBuffer);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile. Please try again.',
        confirmButtonColor: '#217964'
      });
    }
  };

  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    try {
      await axiosInstance.post('notification/api/v1/email/send-verification', {
        email: userDetails.email
      });
      setVerifyingEmail(false);
      setShowEmailPinInput(true);
    } catch (error) {
      setVerifyingEmail(false);
      console.error('Error sending email verification:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send verification email. Please try again.',
        confirmButtonColor: '#217964'
      });
    }
  };

  const handleVerifyPhone = async () => {
    setVerifyingPhone(true);
    try {
      await axiosInstance.post('notification/api/v1/whatsapp/send-verification', {
        phoneNumber: userDetails.contactNumber
      });
      setVerifyingPhone(false);
      setShowPhonePinInput(true);
    } catch (error) {
      setVerifyingPhone(false);
      console.error('Error sending WhatsApp verification:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send verification code. Please try again.',
        confirmButtonColor: '#217964'
      });
    }
  };

  const handleEmailPinComplete = async (code) => {
    try {
      await axiosInstance.post('notification/api/v1/email/verify-code', {
        email: userDetails.email,
        verificationCode: code
      });
      
      setUserDetails(prev => ({ ...prev, isEmailVerified: true }));
      setEditBuffer(prev => ({ ...prev, isEmailVerified: true }));
      setShowEmailPinInput(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Email Verified!',
        text: 'Your email address has been successfully verified.',
        confirmButtonColor: '#217964'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Code',
        text: 'The verification code is incorrect or expired. Please try again.',
        confirmButtonColor: '#217964'
      });
    }
  };

  const handlePhonePinComplete = async (code) => {
    try {
      await axiosInstance.post('notification/api/v1/whatsapp/verify-code', {
        phoneNumber: userDetails.contactNumber,
        pin: code
      });
      
      setUserDetails(prev => ({ ...prev, isNumberVerified: true }));
      setEditBuffer(prev => ({ ...prev, isNumberVerified: true }));
      setShowPhonePinInput(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Phone Verified!',
        text: 'Your phone number has been successfully verified.',
        confirmButtonColor: '#217964'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Code',
        text: 'The verification code is incorrect or expired. Please try again.',
        confirmButtonColor: '#217964'
      });
    }
  };

  const handleEmailPinCancel = () => {
    setShowEmailPinInput(false);
  };

  const handlePhonePinCancel = () => {
    setShowPhonePinInput(false);
  };

  const handleCancel = () => {
    setEditBuffer(userDetails);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#217964] animate-spin mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        <FontAwesomeIcon icon={faUser} className="mr-3 text-[#217964]" />
        User Profile
      </h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <img
            src={profileImage || "https://placehold.co/128x128/217964/FFFFFF?text=No+Image"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
          />

          <label className="absolute bottom-1 right-1 bg-[#217964] text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-[#1a5f4f] transition-colors">
            <FontAwesomeIcon icon={faCamera} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
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
              <input
                name="name"
                value={editBuffer.name}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {userDetails.name || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Email (read-only) */}
        <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
          <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 mr-4 text-gray-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Email Address (Read Only)</p>
            <div className="flex items-center space-x-2">
              <p className="text-lg font-mono text-gray-900">{userDetails.email || "Loading..."}</p>
              {userDetails.email && (
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon 
                    icon={userDetails.isEmailVerified ? faCheckCircle : faExclamationCircle} 
                    className={`text-sm ${userDetails.isEmailVerified ? 'text-green-500' : 'text-orange-500'}`} 
                  />
                  <span className={`text-xs font-medium ${userDetails.isEmailVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {userDetails.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                  {userDetails.isEmailVerified !== true && (
                    <button 
                      onClick={() => handleVerifyEmail()}
                      className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Verify
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faPhone} className="w-6 h-6 mr-4 text-[#217964]" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500">Phone Number</p>

            {editing ? (
              <input
                name="contactNumber"
                value={editBuffer.contactNumber}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Enter phone number"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <p className="text-lg text-gray-900">{userDetails.contactNumber || "Not provided"}</p>
                {userDetails.contactNumber && (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon 
                      icon={userDetails.isNumberVerified ? faCheckCircle : faExclamationCircle} 
                      className={`text-sm ${userDetails.isNumberVerified ? 'text-green-500' : 'text-orange-500'}`} 
                    />
                    <span className={`text-xs font-medium ${userDetails.isNumberVerified ? 'text-green-600' : 'text-orange-600'}`}>
                      {userDetails.isNumberVerified ? 'Verified' : 'Not Verified'}
                    </span>
                    {userDetails.isNumberVerified !== true && (
                      <button 
                        onClick={() => handleVerifyPhone()}
                        className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                )}
              </div>
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
                name="address.street1"
                value={editBuffer.address?.street1 || ""}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Enter address line 1"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.address?.street1 || "Not provided"}</p>
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
                name="address.street2"
                value={editBuffer.address?.street2 || ""}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Enter address line 2 (optional)"
              />
            ) : (
              <p className="text-lg text-gray-900">
                {userDetails.address?.street2 || "—"}
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
                name="address.city"
                value={editBuffer.address?.city || ""}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Enter city"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.address?.city || "Not provided"}</p>
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
                name="address.state"
                value={editBuffer.address?.state || ""}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Enter state/province"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.address?.state || "Not provided"}</p>
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
                name="address.postalCode"
                value={editBuffer.address?.postalCode || ""}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Enter postal code"
              />
            ) : (
              <p className="text-lg text-gray-900">{userDetails.address?.postalCode || "Not provided"}</p>
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
                name="googleMapsUrl"
                value={editBuffer.googleMapsUrl}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Enter Google Maps URL"
              />
            ) : (
              userDetails.googleMapsUrl ? (
                <a
                  href={userDetails.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-blue-600 underline"
                >
                  View Location
                </a>
              ) : (
                <p className="text-lg text-gray-900">Not provided</p>
              )
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
      
      {showEmailPinInput && (
        <PinInput 
          title="Email Verification"
          onComplete={handleEmailPinComplete}
          onCancel={handleEmailPinCancel}
        />
      )}
      
      {showPhonePinInput && (
        <PinInput 
          title="Phone Verification"
          onComplete={handlePhonePinComplete}
          onCancel={handlePhonePinCancel}
        />
      )}
    </div>
  );
};

export default Profile;
