import { Button } from "../ui/button";
import { Bell, Search, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";
import UserAvatar from "../shared/UserAvatar";

const RepNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 h-16 py-3 bg-gray-200 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="MedMate Logo"
          className="h-18 w-auto object-contain"
        />
        <span className="font-bold text-xl">MedMate</span>
      </div>

      {/* Navigation links */}
      <div className="flex items-center space-x-6">
        <NavLink to="/rep/dashboard" end>
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={`${
                isActive ? "text-blue-600" : "text-black"
              } hover:bg-transparent`}
            >
              Dashboard
            </Button>
          )}
        </NavLink>

        <NavLink to="/rep/subscription">
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={`${
                isActive ? "text-blue-600" : "text-black"
              } hover:bg-transparent`}
            >
              Subscription
            </Button>
          )}
        </NavLink>

        <NavLink to="/rep/network">
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={`${
                isActive ? "text-blue-600" : "text-black"
              } hover:bg-transparent`}
            >
              Search Network
            </Button>
          )}
        </NavLink>

        <NavLink to="/rep/analytics">
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={`${
                isActive ? "text-blue-600" : "text-black"
              } hover:bg-transparent`}
            >
              Analytics
            </Button>
          )}
        </NavLink>
        <NavLink to="/rep/message">
          {({ isActive }) => (
            <Mail
              className={`${
                isActive ? "text-blue-600" : "text-black"
              } h-6 w-6 cursor-pointer `}
            />
          )}
        </NavLink>

        <NavLink to="/rep/notification">
          {({ isActive }) => (
            <Bell
              className={`${
                isActive ? "text-blue-600" : "text-black"
              } h-6 w-6 cursor-pointer `}
            />
          )}
        </NavLink>
      </div>

      {/* Search + Avatar */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-2 w-40 sm:w-56 md:w-64 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent shadow-sm"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <UserAvatar  to="/rep/profile"/>
      </div>
    </nav>
  );
};

export default RepNavbar;
