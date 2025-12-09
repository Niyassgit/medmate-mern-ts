import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const GuestNavbar = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setOpen(!open);
  };

  const handleLoginClick = () => {
    navigate("/auth/login/guest");
  };

  return (
    <nav
      className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4
     bg-[#0A1A3F] border-b border-blue-900 text-white"
    >
      {/* Logo */}
      <NavLink to="/guest/dashboard" className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="MedMate Logo"
          className="h-10 w-auto object-contain"
        />
        <span className="font-semibold text-xl text-white">MedMate</span>
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink
          to="/guest/dashboard"
          className={({ isActive }) =>
            `hover:text-indigo-300 transition-colors ${
              isActive ? "text-indigo-300 font-medium" : "text-white"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/guest/about"
          className={({ isActive }) =>
            `hover:text-indigo-300 transition-colors ${
              isActive ? "text-indigo-300 font-medium" : "text-white"
            }`
          }
        >
          About
        </NavLink>
        <NavLink
          to="/guest/contact"
          className={({ isActive }) =>
            `hover:text-indigo-300 transition-colors ${
              isActive ? "text-indigo-300 font-medium" : "text-white"
            }`
          }
        >
          Contact
        </NavLink>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-500 px-3 rounded-full bg-white/10 backdrop-blur-sm">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-400 text-white"
            type="text"
            placeholder="Search products"
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.836 10.615 15 14.695"
              stroke="#9CA3AF"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#9CA3AF"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Cart Icon */}
        <NavLink to="/guest/cart" className="relative cursor-pointer">
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
            3
          </button>
        </NavLink>

        {/* Login Button */}
        <button
          onClick={handleLoginClick}
          className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
        >
          Login
        </button>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        aria-label="Menu"
        className="sm:hidden text-white"
      >
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="21" height="1.5" rx=".75" fill="currentColor" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="currentColor" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="currentColor" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-full left-0 w-full bg-[#0A1A3F] border-b border-blue-900 shadow-md py-4 flex-col items-start gap-2 px-5 text-sm sm:hidden z-50`}
      >
        <NavLink
          to="/guest/dashboard"
          onClick={toggleMobileMenu}
          className={({ isActive }) =>
            `block w-full ${
              isActive ? "text-indigo-300 font-medium" : "text-white"
            } hover:text-indigo-300`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/guest/about"
          onClick={toggleMobileMenu}
          className={({ isActive }) =>
            `block w-full ${
              isActive ? "text-indigo-300 font-medium" : "text-white"
            } hover:text-indigo-300`
          }
        >
          About
        </NavLink>
        <NavLink
          to="/guest/contact"
          onClick={toggleMobileMenu}
          className={({ isActive }) =>
            `block w-full ${
              isActive ? "text-indigo-300 font-medium" : "text-white"
            } hover:text-indigo-300`
          }
        >
          Contact
        </NavLink>
        <button
          onClick={() => {
            toggleMobileMenu();
            handleLoginClick();
          }}
          className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm w-full"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default GuestNavbar;
