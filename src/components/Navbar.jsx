// File: src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullname");
    localStorage.removeItem("username");
    localStorage.removeItem("profile_image");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
              <img
                src="https://placehold.co/48x48?text=SF"
                alt="StayFlow Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-kanit font-bold text-2xl text-white drop-shadow-lg">
              STAYFLOW
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white hover:bg-opacity-10"
            >
              <i className="fas fa-home mr-1"></i> หน้าแรก
            </Link>

            {token ? (
              <div className="flex items-center space-x-3">
                {/* ลิงก์ไปหน้า Review เฉพาะ role owner */}
                {localStorage.getItem("role") === "owner" && (
                  <Link
                    to="/owner/reviews"
                    className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    <i className="fas fa-star mr-1"></i> รีวิว
                  </Link>
                )}

                {/* Username Dropdown */}
                <div className="relative group">
                  <button className="flex items-center text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300">
                    <i className="fas fa-user mr-1"></i> {username}
                    <i className="fas fa-chevron-down ml-1 text-xs"></i>
                  </button>
                  <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 bg-white bg-opacity-95 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-indigo-50"
                    >
                      <i className="fas fa-id-card mr-2"></i> โปรไฟล์
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> ออกจากระบบ
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white hover:bg-opacity-10"
                >
                  <i className="fas fa-user-plus mr-1"></i> สมัครสมาชิก
                </Link>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <i className="fas fa-sign-in-alt mr-1"></i> เข้าสู่ระบบ
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white hover:text-indigo-200 focus:outline-none"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-indigo-600 bg-opacity-95">
          <Link
            to="/"
            className="block px-4 py-2 text-white hover:bg-indigo-500 hover:bg-opacity-30"
          >
            หน้าแรก
          </Link>
          {token ? (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 text-white hover:bg-indigo-500 hover:bg-opacity-30"
              >
                โปรไฟล์
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-white hover:bg-red-500 hover:bg-opacity-70"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="block px-4 py-2 text-white hover:bg-indigo-500 hover:bg-opacity-30"
              >
                สมัครสมาชิก
              </Link>
              <Link
                to="/login"
                className="block px-4 py-2 text-white hover:bg-indigo-500 hover:bg-opacity-30"
              >
                เข้าสู่ระบบ
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
