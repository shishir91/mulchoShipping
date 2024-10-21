import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  DollarSign,
  Clock,
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    if (userInfo && token) {
      return navigate("/dashboard");
    }
  }, []);

  return (
    <div className="mt-20 text-lg font-bold ">
      HomePage is currently under development. You can Login / Register and view
      other features
    </div>
  );

  // return (
  //   <div className="bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen font-sans">
  //     <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
  //       <div className="container mx-auto flex justify-between items-center">
  //         <h1 className="text-3xl font-extrabold tracking-tight">Mulcho</h1>
  //         <nav>
  //           <ul className="flex space-x-6 text-lg">
  //             <li>
  //               <a
  //                 href="#"
  //                 className="hover:text-purple-200 transition duration-300"
  //               >
  //                 Home
  //               </a>
  //             </li>
  //             <li>
  //               <a
  //                 href="#"
  //                 className="hover:text-purple-200 transition duration-300"
  //               >
  //                 About
  //               </a>
  //             </li>
  //             <li>
  //               <a
  //                 href="#"
  //                 className="hover:text-purple-200 transition duration-300"
  //               >
  //                 Login
  //               </a>
  //             </li>
  //           </ul>
  //         </nav>
  //       </div>
  //     </header>

  //     <main className="container mx-auto mt-12 px-4">
  //       <section className="text-center mb-16">
  //         <h2 className="text-5xl font-bold mb-6 text-indigo-800 leading-tight">
  //           From Side Hustle to{" "}
  //           <span className="text-purple-600">Full Time Income</span>
  //         </h2>
  //         <p className="text-2xl mb-8 text-gray-700">
  //           Register at Mulcho and setup your own Passive income at your
  //           fingertip.
  //         </p>
  //         <button className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105">
  //           Get Started
  //         </button>
  //       </section>

  //       <section className="bg-white rounded-2xl shadow-2xl p-8 mb-16 transform hover:scale-105 transition duration-500">
  //         <h3 className="text-3xl font-semibold mb-6 text-indigo-800">
  //           Be Part of an Effective Elite Group
  //         </h3>
  //         <p className="text-xl mb-6 text-gray-700 leading-relaxed">
  //           "Be Part of an effective elite group of 50+ marketers transforming
  //           their financial future! With our platform, they're maximizing their
  //           earning, securing high commission and achieving success faster than
  //           ever."
  //         </p>
  //         <p className="text-2xl font-bold text-purple-600">
  //           Your success starts Today.
  //         </p>
  //       </section>

  //       <section className="grid md:grid-cols-3 gap-8 mb-16">
  //         {[
  //           {
  //             title: "50+",
  //             description: "Registration",
  //             icon: <ArrowRight className="w-12 h-12 text-purple-500 mb-4" />,
  //           },
  //           {
  //             title: "P500+",
  //             description: "Total Order Processed",
  //             icon: <DollarSign className="w-12 h-12 text-indigo-500 mb-4" />,
  //           },
  //           {
  //             title: "8+",
  //             description: "Brand Collaboration",
  //             icon: <Linkedin className="w-12 h-12 text-blue-500 mb-4" />,
  //           },
  //         ].map((item, index) => (
  //           <div
  //             key={index}
  //             className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition duration-300"
  //           >
  //             {item.icon}
  //             <h4 className="text-3xl font-bold mb-2 text-indigo-800">
  //               {item.title}
  //             </h4>
  //             <p className="text-lg text-gray-600">{item.description}</p>
  //           </div>
  //         ))}
  //       </section>

  //       <section className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-2xl p-8 mb-16 text-white">
  //         <h3 className="text-3xl font-semibold mb-6">Why Mulcho?</h3>
  //         <div className="grid md:grid-cols-2 gap-6">
  //           {[
  //             {
  //               text: "Free Registration",
  //               icon: <DollarSign className="w-8 h-8" />,
  //             },
  //             {
  //               text: "High Commission",
  //               icon: <ArrowRight className="w-8 h-8" />,
  //             },
  //             { text: "Time Flexibility", icon: <Clock className="w-8 h-8" /> },
  //             { text: "Free Training", icon: <BookOpen className="w-8 h-8" /> },
  //           ].map((item, index) => (
  //             <div
  //               key={index}
  //               className="flex items-center space-x-4 bg-white bg-opacity-20 rounded-lg p-4"
  //             >
  //               {item.icon}
  //               <span className="text-xl">{item.text}</span>
  //             </div>
  //           ))}
  //         </div>
  //       </section>
  //     </main>

  //     <footer className="bg-indigo-900 text-white py-12">
  //       <div className="container mx-auto px-4">
  //         <div className="grid md:grid-cols-4 gap-8 mb-8">
  //           <div>
  //             <h4 className="text-2xl font-bold mb-4">Mulcho</h4>
  //             <p className="text-indigo-200">
  //               Transforming side hustles into full-time success stories.
  //             </p>
  //           </div>
  //           <div>
  //             <h5 className="text-xl font-semibold mb-4">Quick Links</h5>
  //             <ul className="space-y-2">
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-indigo-200 hover:text-white transition duration-300"
  //                 >
  //                   Home
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-indigo-200 hover:text-white transition duration-300"
  //                 >
  //                   About Us
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-indigo-200 hover:text-white transition duration-300"
  //                 >
  //                   Services
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-indigo-200 hover:text-white transition duration-300"
  //                 >
  //                   Contact
  //                 </a>
  //               </li>
  //             </ul>
  //           </div>
  //           <div>
  //             <h5 className="text-xl font-semibold mb-4">Legal</h5>
  //             <ul className="space-y-2">
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-indigo-200 hover:text-white transition duration-300"
  //                 >
  //                   Terms of Service
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-indigo-200 hover:text-white transition duration-300"
  //                 >
  //                   Privacy Policy
  //                 </a>
  //               </li>
  //             </ul>
  //           </div>
  //           <div>
  //             <h5 className="text-xl font-semibold mb-4">Connect With Us</h5>
  //             <div className="flex space-x-4">
  //               <a
  //                 href="#"
  //                 className="text-indigo-200 hover:text-white transition duration-300"
  //               >
  //                 <Facebook />
  //               </a>
  //               <a
  //                 href="#"
  //                 className="text-indigo-200 hover:text-white transition duration-300"
  //               >
  //                 <Twitter />
  //               </a>
  //               <a
  //                 href="#"
  //                 className="text-indigo-200 hover:text-white transition duration-300"
  //               >
  //                 <Instagram />
  //               </a>
  //               <a
  //                 href="#"
  //                 className="text-indigo-200 hover:text-white transition duration-300"
  //               >
  //                 <Linkedin />
  //               </a>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="text-center text-indigo-200 border-t border-indigo-800 pt-8">
  //           <p>&copy; 2024 Mulcho. All rights reserved.</p>
  //         </div>
  //       </div>
  //     </footer>
  //   </div>
  // );
};

export default HomePage;
