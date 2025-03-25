import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <Outlet />
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <div className="container mx-auto">
          <p className="text-sm">© {new Date().getFullYear()} Blog App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
