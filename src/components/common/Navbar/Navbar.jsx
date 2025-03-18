import React from 'react';
import logo from "../../../Images/logo.png"
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="w-16 h-8 flex items-center">
        <img src={logo} alt="Government of India Logo" className="w-200px h-200px " />
      </div>
      
      {/* Navigation Links */}
      <div className="flex space-x-8">
        <a href="#" className="text-gray-600 hover:text-gray-900">About us</a>
        <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
        <a href="#" className="text-gray-600 hover:text-gray-900">Case Studies</a>
        <a href="#" className="text-gray-600 hover:text-gray-900">How it Works</a>
      </div>
      
      {/* Get Started Button */}
      <button className="px-4 py-2 text-white rounded-md hover:bg-purple-700 transition duration-300 bg-gradient-to-br from-[#6675F7] to-[#57007B]">
        Get Started
      </button>
    </nav>
  );
};

export default Navbar;
