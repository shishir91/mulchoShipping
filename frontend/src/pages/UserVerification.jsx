import React, { useEffect, useState } from "react";
import api from "../api/config.js";
import {
  PhoneIcon,
  CalendarIcon,
  LinkIcon,
  IdentificationIcon,
  PhotoIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const UserVerification = () => {
  const [formData, setFormData] = useState({});
  const [imageData, setImageData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { updateUserInfo, authState } = useAuth();
  const { userInfo: user, token } = authState;

  useEffect(() => {
    if (user.status == "underReview") {
      toast.success(
        "Your profile is under review. You will be notify soon once its done.",
        {
          duration: 3000,
          onAutoClose: () => navigate("/dashboard"),
        }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setIsLoading(true);
    const response = await api.put(
      "/user/kyc",
      { ...formData, payment: imageData },
      { headers: { token, "Content-Type": "multipart/form-data" } }
    );
    setIsLoading(false);
    if (response.data.success) {
      await updateUserInfo(response.data.data);
      toast.success(
        "Form Submitted. Your profile is under review. You will be notify soon once its done.",
        {
          duration: 5000,
          onAutoClose: () => navigate("/dashboard"),
        }
      );
    } else {
      toast.error(response.data.message, {
        duration: 2000,
      });
    }
  };

  return (
    <div className="p-6 sm:ml-64">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        {isLoading && <Loading />}
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <IdentificationIcon className="h-6 w-6 text-blue-500 mr-2" />
          User Verification
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Phone Number Field */}
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number*
            </label>
            <div className="relative mt-1">
              <PhoneIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="123-456-7890"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Date of Birth Field */}
          <div className="mb-4">
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth*
            </label>
            <div className="relative mt-1">
              <CalendarIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="dob"
                id="dob"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Facebook Profile Link Field */}
          <div className="mb-4">
            <label
              htmlFor="facebookLink"
              className="block text-sm font-medium text-gray-700"
            >
              Facebook Profile Link*
            </label>
            <div className="relative mt-1">
              <LinkIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                name="fb"
                id="fb"
                placeholder="https://www.facebook.com/yourprofile"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.facebookLink}
                onChange={handleInputChange}
                payment
                required
              />
            </div>
          </div>

          {/* Gender Field */}
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender*
            </label>
            <select
              name="gender"
              id="gender"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled selected>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* QR Code Image Field */}
          <div className="mb-6">
            <label
              htmlFor="qrCodeFile"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Payment Method QR Code*
            </label>
            <div className="relative mt-1">
              <PhotoIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
              <input
                type="file"
                name="payment"
                id="payment"
                accept="image/*"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setImageData(e.target.files[0])}
                required
              />
              {imageData ? (
                <img src={URL.createObjectURL(imageData)} width={"200px"} />
              ) : (
                <img src="" />
              )}
            </div>
          </div>

          {/* Refered Field */}
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Refered By
            </label>
            <div className="relative mt-1">
              <UserIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="referedby"
                id="referedBy"
                placeholder=""
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.referedBy}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserVerification;
