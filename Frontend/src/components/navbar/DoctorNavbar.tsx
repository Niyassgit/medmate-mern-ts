import { Button } from "../ui/button";
import { Bell, Search, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";
import UserAvatar from "../shared/UserAvatar";

const DoctorNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 h-16 py-3 bg-[#E8618C] shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="MedMate Logo"
          className="h-18 w-auto object-contain"
        />
        <span className="font-bold text-xl -ml-6 mb-4">MedMate</span>
      </div>

      {/* Navigation links */}
      <div className="flex items-center space-x-6">
        <NavLink to="/doctor/feed">
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={`hover:bg-transparent hover:text-gray-300 ${
                isActive ? "text-blue-600 font-semibold" : "text-white"
              }`}
            >
              Feed
            </Button>
          )}
        </NavLink>

        <NavLink to="/doctor/analytics">
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={`hover:bg-transparent hover:text-gray-300 ${
                isActive ? "text-blue-600 font-semibold" : "text-white"
              }`}
            >
              Connections
            </Button>
          )}
        </NavLink>

        <NavLink to="/doctor/network">
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={`hover:bg-transparent hover:text-gray-300 ${
                isActive ? "text-blue-600 font-semibold" : "text-white"
              }`}
            >
              Search Network
            </Button>
          )}
        </NavLink>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-2 w-40 sm:w-56 md:w-64 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-700 focus:border-transparent shadow-sm"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <NavLink to="/doctor/messages">
          {({ isActive }) => (
            <Mail
              className={`h-6 w-6 cursor-pointer hover:text-gray-300 ${
                isActive ? "text-blue-600" : "text-white"
              }`}
            />
          )}
        </NavLink>

        <NavLink to="/doctor/notifications">
          {({ isActive }) => (
            <Bell
              className={`h-6 w-6 cursor-pointer hover:text-gray-300 ${
                isActive ? "text-blue-600" : "text-white"
              }`}
            />
          )}
        </NavLink>

        <UserAvatar to="/doctor/profile" />
      </div>
    </nav>
  );
};

export default DoctorNavbar;
