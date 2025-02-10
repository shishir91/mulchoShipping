import React, { useEffect, useState } from "react";
import img1 from "/images/logo.png";
import img2 from "/images/laptopimage.png";
import img3 from "/images/arrowImage.png";
import work1 from "/images/work1.png";
import work2 from "/images/work2.png";
import work3 from "/images/work3.png";
import work4 from "/images/work4.png";
import registration from "/images/registration.png";
import cart from "/images/cart.png";
import ninePlus from "/images/9+.png";
import {
  Facebook,
  Instagram,
  Linkedin,
  Send,
  Globe,
  Phone,
  Menu,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    if (userInfo && token) {
      return navigate("/dashboard");
    }
  }, []);

  return (
    // <div className="mt-20 text-lg font-bold ">
    //   HomePage is currently under development. You can Login / Register and view
    //   other features
    // </div>

    <div className="min-h-screen bg-[#b7ebb9]" id="home">
      {/* Main Content */}
      <div className="container mx-auto px-1 py-5 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Column - Text Content */}
          <div className="space-y-1">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                From Side Hustle To
              </h1>
              <div className="flex items-center gap-3 pl-4">
                <img src={img3} alt="Arrow" className="w-32 h-auto" />
                <span className="text-4xl md:text-5xl font-bold text-gray-800">
                  Full Time Income
                </span>
              </div>
            </div>

            <p className="text-xl font-semibold md:text-2xl  text-gray-700 max-w-lg leading-relaxed">
              Be a part of Mulcho-Shipping Today And
              <br />
              Start Your Passive Income
              <br />
              At Your Own Fingertip.
            </p>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <img
              src={img2}
              alt="E-commerce Dashboard Preview"
              className="rounded-3xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-16" id="about">
        <div className="max-w-6xl mx-auto px-4">
          {/* Title */}
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            How does Mulcho Work?
          </h2>

          {/* Process Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 - Promote Products */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="w-32 h-32 mb-2">
                <img
                  src={work1}
                  alt="Promote Products"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Promote Products
              </h3>
              <p className="text-md font-semibold text-[#B08D57]">
                Advertise items in social platforms
              </p>
            </div>

            {/* Step 2 - Order Confirmation */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="w-32 h-32 mb-2">
                <img
                  src={work2}
                  alt="Order Confirmation"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Order Confirmation
              </h3>
              <p className="text-md font-semibold  text-[#B08D57]">
                You receive orders
              </p>
            </div>

            {/* Step 3 - We Deliver */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="w-32 h-32 mb-2">
                <img
                  src={work3}
                  alt="Fast Delivery"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">We Deliver</h3>
              <p className="text-md font-semibold text-[#B08D57]">
                We deliver the product
              </p>
            </div>

            {/* Step 4 - Commission */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="w-32 h-32 mb-2">
                <img
                  src={work4}
                  alt="Commission"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Commission</h3>
              <p className="text-md font-semibold text-[#B08D57]">
                You receive commission
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section remains the same */}
      <div className="bg-[#b7ebb9] py-24" id="highlights">
        <div className="max-w-6xl mx-auto px-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Registration Stats */}
            <div className="flex flex-col items-center text-center px-8">
              <img
                src={registration}
                alt="Registrations"
                className="w-20 h-20 mb-4"
              />
              <p className="text-lg font-semibold  text-gray-800">
                "Over 50 registrations and counting—join us today!"
              </p>
            </div>

            {/* Orders Stats */}
            <div className="flex flex-col items-center text-center px-8">
              <img src={cart} alt="Orders" className="w-20 h-20 mb-4" />
              <p className="text-lg font-semibold text-gray-800">
                Over 2,500 orders processed successfully and counting
              </p>
            </div>

            {/* Brands Stats */}
            <div className="flex flex-col items-center text-center px-8">
              <img src={ninePlus} alt="Brands" className="w-28 h-24 mb-0" />
              <p className="text-lg font-semibold text-gray-800">
                Featuring a collection of over 9 top brands
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-tight">
            Join an elite group of 50+ marketers transforming their financial
            future. With our platform, they maximize earnings, secure high
            commissions, and achieve success faster than ever.
          </h2>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#b7ebb9]  py-12" id="contact">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Why Mulcho */}
            <div>
              <h3 className="font-bold text-xl mb-4">Why Mulcho?</h3>
              <ul className="space-y-2">
                <li>-Free Registration</li>
                <li>-High Commission</li>
                <li>-Time Flexibility</li>
                <li>-Free Training</li>
              </ul>
            </div>

            {/* Follow Us Section */}
            <div className="flex flex-col ">
              <h3 className="font-bold text-xl mb-4 ml-10">Follow Us</h3>
              <div className="flex space-x-4">
                <Facebook className="w-8 h-8 cursor-pointer hover:text-blue-600 transition-colors" />
                <Instagram className="w-8 h-8 cursor-pointer hover:text-pink-600 transition-colors" />
                <Linkedin className="w-8 h-8 cursor-pointer hover:text-blue-700 transition-colors" />
                <svg
                  className="w-8 h-8 cursor-pointer hover:text-black transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  <path d="M13 12V8a5 5 0 0 0 5-5" />
                </svg>
              </div>
            </div>

            {/* Know us & Support */}
            <div>
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-4">Know us</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <Send className="w-5 h-5" />
                  <span>mulcho456@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>www.mulcho-shipping.netlify.app</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl border-t-2 border-black mb-4">
                  Support
                </h3>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>9828890838, 9860648501</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
