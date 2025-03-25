import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiEdit, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem("token");
    useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-Black-600 font-bold text-xl md:text-2xl">Swathi</span>
            <span className="font-bold text-Black-800 text-xl md:text-2xl">Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/" 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center">
                <FiHome className="mr-1" /> Home
              </span>
            </Link>

            {/* Create Post button */}
            {token && (
              <Link
                to="/create"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/create" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center">
                  <FiEdit className="mr-1" /> Create Post
                </span>
              </Link>
            )}
            
            {/* Always show logout if token exists */}
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
              >
                <span className="flex items-center">
                  <FiLogOut className="mr-1" /> Logout
                </span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* Always show logout if token exists */}
            {token && (
              <button
                onClick={handleLogout}
                className="mr-2 inline-flex items-center justify-center p-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/" 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center">
              <FiHome className="mr-2" /> Home
            </span>
          </Link>

          {token && (
            <>
              <Link
                to="/create"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === "/create" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center">
                  <FiEdit className="mr-2" /> Create Post
                </span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-500 text-white hover:bg-red-600"
              >
                <span className="flex items-center">
                  <FiLogOut className="mr-2" /> Logout
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;