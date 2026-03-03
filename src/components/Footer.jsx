// src/components/footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-dark to-gray-800 text-white py-1 mt-auto">
      <div className="max-w-6xl mx-auto px-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <i className="fas fa-building text-white text-lg"></i>
              </div>
              <span className="font-kanit font-bold text-lg">Stayflow</span>
            </div>
            <p className="mt-1 text-gray-400 text-xs">ระบบจัดการหอพักอันดับ 1</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex items-center">
                <i className="fas fa-phone-alt mr-2"></i>
                <span>02-123-4567</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <span>contact@stayflow.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-1 pt-2 border-t border-gray-700 text-center text-gray-400 text-xs">
          <p>&copy; {new Date().getFullYear()} Stayflow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;