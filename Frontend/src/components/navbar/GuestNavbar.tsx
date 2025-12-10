import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserAvatar from "../shared/UserAvatar";

const GuestNavbar = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setOpen((prev) => !prev);

  return (
    <div className="w-full flex justify-center mb-4 px-4">
      <nav
        className="
      w-[65%] md:w-[55%] lg:w-[45%] max-w-[650px]   
      flex items-center justify-between
      px-6 md:px-8 py-4.5                    
      rounded-full shadow-xl
      bg-gradient-to-r from-[#0A1A3F] to-[#000000]
      text-white border border-white/10
      relative
    "
      >
        {/* Logo */}
        <NavLink to="/guest/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="MedMate Logo" className="h-8 w-auto" />
          <span className="font-semibold text-lg">MedMate</span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          {[
            { name: "Home", to: "/guest/dashboard" },
            { name: "Prescriptions", to: "/guest/prescriptions" },
            { name: "Orders", to: "/guest/orders" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `hover:text-indigo-300 transition ${
                  isActive ? "text-indigo-300 font-medium" : "text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Profile Avatar */}
          <UserAvatar to="/guest/profile" />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMobileMenu} className="sm:hidden text-white">
          <svg width="22" height="18" fill="currentColor">
            <rect width="22" height="2" rx="1" />
            <rect y="8" width="22" height="2" rx="1" />
            <rect y="16" width="22" height="2" rx="1" />
          </svg>
        </button>

        {/* Mobile Dropdown */}
        {open && (
          <div
            className="
            absolute top-full left-0 w-full 
            bg-[#0F172A] rounded-b-2xl border border-t-white/10
            flex flex-col items-start gap-3 px-6 py-4 text-sm sm:hidden z-50
          "
          >
            {[
              { name: "Home", to: "/guest/dashboard" },
              { name: "Prescriptions", to: "/guest/prescriptions" },
              { name: "Orders", to: "/guest/orders" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `block w-full py-1 ${
                    isActive ? "text-indigo-300 font-medium" : "text-white"
                  } hover:text-indigo-300`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
};

export default GuestNavbar;
