// File: src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children, role, showFooter = true, showNav = true }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      {showNav && <Navbar role={role} />}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar role={role} />
        {/* Main Content → scroll ได้เฉพาะตรงนี้ */}
        <main className="flex-1 overflow-y-auto h-screen bg-gradient-to-br from-indigo-50 to-purple-100 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
