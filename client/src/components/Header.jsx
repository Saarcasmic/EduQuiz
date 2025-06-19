import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/signin');
  };

  return (
    <header className="w-full bg-indigo-600 text-white shadow-lg rounded-b-3xl px-6 py-1 flex items-center justify-between relative z-20">
      {/* Left: Logo/Title */}
      <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        {/* You can replace this with an actual logo icon if desired */}
        <span className="text-2xl font-bold tracking-tight select-none text-white">EduQuiz</span>
      </Link>

      {/* Right: Authenticated or Unauthenticated */}
      <div className="flex items-center gap-6">
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full transition-shadow"
              onClick={() => setIsDropdownOpen((open) => !open)}
              aria-label="Open user menu"
            >
              <UserCircle className="w-10 h-10 text-white hover:text-indigo-200 transition-colors cursor-pointer" />
            </button>
            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-gray-900 text-white rounded-xl shadow-2xl py-2 z-30 animate-fade-in-up border border-gray-800">
                <div className="px-4 py-2 text-sm font-medium truncate border-b border-gray-800 select-none">
                  {user.email}
                </div>
                <button
                  className="w-full flex items-center gap-2 py-2 px-4 text-left text-red-500 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors mt-1"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/signin"
              className="px-5 py-2 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800 transition-colors shadow-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 