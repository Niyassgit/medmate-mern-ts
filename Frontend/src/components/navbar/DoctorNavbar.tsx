import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Bell, Mail, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import UserAvatar from "../shared/UserAvatar";
import { notificationUnreadCount } from "@/features/doctor/api";
import { useSelector } from "react-redux";
import { getSocket } from "@/lib/socket";

const DoctorNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = useSelector((state: any) => state.auth.user?.id);
  const token = useMemo(() => localStorage.getItem("accessToken"), []);

  useEffect(() => {
    if (!userId) return;
    const fetchUnread = async (id: string) => {
      const res = await notificationUnreadCount(id);
      setUnreadCount(res.data || 0);
    };
    fetchUnread(userId);
  }, [userId]);
  const navLinkClass = (isActive: boolean) =>
    `hover:text-gray-200 transition ${
      isActive ? "text-blue-600 font-semibold" : "text-white"
    }`;

  useEffect(() => {
    if (!token || !userId) return;
    const socket = getSocket(token);
    socket.on("notification:count", (data) => {
      setUnreadCount(data);
    });

    return () => {
      socket.off("notification:count");
    };
  }, [token, userId]);
  return (
    <nav className="bg-[#E8618C] shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="MedMate Logo"
            className="h-18 object-contain"
          />
          <span className="font-semibold text-2xl">MedMate</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          {[
            { label: "Feed", to: "/doctor/feed" },
            { label: "Connections", to: "/doctor/analytics" },
            { label: "Search Network", to: "/doctor/network" },
          ].map((item) => (
            <NavLink key={item.to} to={item.to} end>
              {({ isActive }) => (
                <Button variant="ghost" className={navLinkClass(isActive)}>
                  {item.label}
                </Button>
              )}
            </NavLink>
          ))}

          {/* Icons */}
          <NavLink to="/doctor/messages">
            {({ isActive }) => (
              <Mail
                className={`h-6 w-6 cursor-pointer hover:text-gray-200 ${navLinkClass(
                  isActive
                )}`}
              />
            )}
          </NavLink>

          <NavLink to="/doctor/notifications">
            {({ isActive }) => (
              <div className="relative w-fit">
                <Bell
                  className={`h-6 w-6 cursor-pointer hover:text-gray-200 ${navLinkClass(
                    isActive
                  )}`}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-[1px]">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            )}
          </NavLink>

          <UserAvatar to="/doctor/profile" />
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white hover:text-gray-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-6 pb-5 mt-2">
          {[
            { label: "Feed", to: "/doctor/feed" },
            { label: "Connections", to: "/doctor/analytics" },
            { label: "Search Network", to: "/doctor/network" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={() => setMobileOpen(false)}
            >
              {({ isActive }) => (
                <span
                  className={`block font-semibold text-lg ${navLinkClass(
                    isActive
                  )}`}
                >
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}

          {/* Icons + Avatar */}
          <div className="flex items-center space-x-6 mt-2">
            <NavLink to="/doctor/messages" onClick={() => setMobileOpen(false)}>
              {({ isActive }) => (
                <Mail
                  className={`h-6 w-6 cursor-pointer hover:text-gray-200 ${navLinkClass(
                    isActive
                  )}`}
                />
              )}
            </NavLink>

            <NavLink
              to="/doctor/notifications"
              onClick={() => setMobileOpen(false)}
            >
              {({ isActive }) => (
                <div className="relative w-fit">
                  <Bell
                    className={`h-6 w-6 cursor-pointer hover:text-gray-200 ${navLinkClass(
                      isActive
                    )}`}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-[1px]">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>

            <UserAvatar to="/doctor/profile" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default DoctorNavbar;
