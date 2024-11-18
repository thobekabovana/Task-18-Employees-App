import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route location

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if current page is '/addForm', '/list', or '/view' to hide "Get Started" button
  const shouldShowGetStartedButton =
    location.pathname !== '/addForm' && location.pathname !== '/list' && location.pathname !== '/view';

  // Check if current page is '/landing', '/register', '/login', '/list', or '/view' to hide "List" button
  const shouldShowListButton =
    location.pathname !== '/landing' &&
    location.pathname !== '/register' &&
    location.pathname !== '/logIn' &&
    location.pathname !== '/list' &&
    location.pathname !== '/view';

  return (
    <header className="bg-white shadow-md fixed w-full z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => navigate('/landing')}
          className="text-2xl font-bold text-gray-800 hover:text-gray-600"
        >
          Mannings Thobeka
        </button>
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-6 items-center">
          <button
            onClick={() => navigate('/landing')}
            className="text-gray-700 hover:text-gray-900"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/footer')}
            className="text-gray-700 hover:text-gray-900"
          >
            Contact
          </button>

          {/* Conditionally render "Get Started" Button */}
          {shouldShowGetStartedButton && (
            <button
              onClick={() => navigate('/register')}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              Get Started
            </button>
          )}

          {/* Conditionally render "List" Button */}
          {shouldShowListButton && (
            <button
              onClick={() => navigate('/list')}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              List
            </button>
          )}
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="space-y-2 px-6 py-4">
            <li>
              <button
                onClick={() => {
                  toggleMobileMenu();
                  navigate('/landing');
                }}
                className="block text-gray-700 hover:text-gray-900"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  toggleMobileMenu();
                  navigate('/footer');
                }}
                className="block text-gray-700 hover:text-gray-900"
              >
                Contact
              </button>
            </li>

            {/* Conditionally render "Get Started" Button for Mobile */}
            {shouldShowGetStartedButton && (
              <li>
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    navigate('/register');
                  }}
                  className="w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700"
                >
                  Get Started
                </button>
              </li>
            )}

            {/* Conditionally render "List" Button for Mobile */}
            {shouldShowListButton && (
              <li>
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    navigate('/list');
                  }}
                  className="w-full bg-pink-800 text-white px-4 py-2 rounded hover:bg-pink-700"
                >
                  List
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
