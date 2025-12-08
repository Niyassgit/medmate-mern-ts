import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Bell, Layout, Mail, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import UserAvatar from "../shared/UserAvatar";
import { unreadNotificationCount, repConversations } from "@/features/rep/api";
import { useSelector } from "react-redux";
import { getSocket } from "@/lib/socket";
import { MessageDTO } from "../Dto/MessageDTO";
import { Role } from "@/types/Role";
import { Conversation } from "../Dto/Conversation";

const RepNavbar = () => {
  const userId = useSelector((state: any) => state.auth.user?.id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const token = useMemo(() => localStorage.getItem("accessToken"), []);
  const [businessOpen, setBusinessOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchUnread = async (id: string) => {
      const res = await unreadNotificationCount(id);
      setUnreadCount(res.data || 0);
    };
    fetchUnread(userId);
  }, [userId]);

  const updateUnreadChatCount = useCallback(async () => {
    try {
      const res = await repConversations();
      const totalUnread =
        res.data?.reduce(
          (sum: number, conv: any) => sum + (conv.unread || 0),
          0
        ) || 0;
      setUnreadChatCount(totalUnread);
    } catch (err) {
      console.error("Failed to fetch unread chat count", err);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    updateUnreadChatCount();
  }, [userId, updateUnreadChatCount]);

  useEffect(() => {
    if (!token || !userId) return;

    const socket = getSocket(token);
    socket.on("notification:count", (data) => setUnreadCount(data));

    return () => {
      socket.off("notification:count");
    };
  }, [token, userId]);

  // Socket for chat events
  useEffect(() => {
    if (!token || !userId) return;
    const socket = getSocket(token);

    const join = async () => {
      const res = await repConversations();
      (res.data || []).forEach((c: Conversation) =>
        socket.emit("join_conversation", c.id)
      );
    };

    socket.connected ? join() : socket.once("connect", join);
    socket.on("new_message", (message: MessageDTO) => {
      if (message.senderRole !== Role.MEDICAL_REP)
        setUnreadChatCount((p) => p + 1);
    });
    socket.on("message_seen", () => updateUnreadChatCount());

    return () => {
      socket.off("new_message");
      socket.off("message_seen");
    };
  }, [token, userId, updateUnreadChatCount]);

  const navLinkClass = (isActive: boolean) =>
    `${isActive ? "text-blue-600" : "text-black"} hover:text-blue-500`;

  return (
    <nav className="bg-gray-200 shadow-md">
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

        {/* ================== Desktop Navbar ================== */}
        <div className="hidden md:flex items-center space-x-6">
          {[
            { label: "Dashboard", to: "/rep/dashboard" },
            { label: "Subscription", to: "/rep/subscription" },
            { label: "Search Network", to: "/rep/network" },
          ].map((item) => (
            <NavLink key={item.to} to={item.to} end>
              {({ isActive }) => (
                <Button variant="ghost" className={navLinkClass(isActive)}>
                  {item.label}
                </Button>
              )}
            </NavLink>
          ))}

          <div className="relative">
            <Button
              variant="ghost"
              className="text-black hover:text-blue-500"
              onClick={() => setBusinessOpen((prev) => !prev)}
            >
              <Layout />
              Business ▾
            </Button>

            {businessOpen && (
              <div className="absolute bg-white shadow-lg rounded-md mt-2 min-w-[160px] z-30">
                <NavLink
                  to="/rep/business/products"
                  onClick={() => setBusinessOpen(false)}
                >
                  {({ isActive }) => (
                    <div
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        isActive ? "text-blue-600 font-medium" : ""
                      }`}
                    >
                      Products
                    </div>
                  )}
                </NavLink>

                <NavLink
                  to="/rep/business/orders"
                  onClick={() => setBusinessOpen(false)}
                >
                  {({ isActive }) => (
                    <div
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        isActive ? "text-blue-600 font-medium" : ""
                      }`}
                    >
                      Orders
                    </div>
                  )}
                </NavLink>
              </div>
            )}
          </div>

          {/* Continue Default */}
          <NavLink to="/rep/analytics">
            {({ isActive }) => (
              <Button variant="ghost" className={navLinkClass(isActive)}>
                Analytics
              </Button>
            )}
          </NavLink>

          {/* Icons */}
          <NavLink to="/rep/message">
            {({ isActive }) => (
              <div className="relative w-fit">
                <Mail
                  className={`${navLinkClass(isActive)} h-6 w-6 cursor-pointer`}
                />
                {unreadChatCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-[1px]">
                    {unreadChatCount > 99 ? "99+" : unreadChatCount}
                  </span>
                )}
              </div>
            )}
          </NavLink>

          <NavLink to="/rep/notification">
            {({ isActive }) => (
              <div className="relative w-fit">
                <Bell
                  className={`${navLinkClass(isActive)} h-6 w-6 cursor-pointer`}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-[1px]">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            )}
          </NavLink>

          <UserAvatar to="/rep/profile" />
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden block"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ================== Mobile Menu ================== */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-6 pb-4">
          <NavLink
            to="/rep/dashboard"
            onClick={() => setMobileOpen(false)}
            className="font-medium text-black hover:text-blue-500"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/rep/subscription"
            onClick={() => setMobileOpen(false)}
            className="font-medium text-black hover:text-blue-500"
          >
            Subscription
          </NavLink>
          <NavLink
            to="/rep/network"
            onClick={() => setMobileOpen(false)}
            className="font-medium text-black hover:text-blue-500"
          >
            Search Network
          </NavLink>

          {/* Business mobile drop options */}
          <span className="font-semibold text-black mt-2">Business</span>

          <NavLink
            to="/rep/business/products"
            onClick={() => setMobileOpen(false)}
            className="ml-4 block text-black hover:text-blue-500"
          >
            Products
          </NavLink>

          <NavLink
            to="/rep/business/orders"
            onClick={() => setMobileOpen(false)}
            className="ml-4 block text-black hover:text-blue-500"
          >
            Orders
          </NavLink>

          <NavLink
            to="/rep/analytics"
            onClick={() => setMobileOpen(false)}
            className="font-medium text-black hover:text-blue-500"
          >
            Analytics
          </NavLink>

          <div className="flex items-center space-x-6 mt-3">
            <NavLink to="/rep/message" onClick={() => setMobileOpen(false)}>
              <Mail className="h-6 w-6" />
            </NavLink>
            <NavLink
              to="/rep/notification"
              onClick={() => setMobileOpen(false)}
            >
              <Bell className="h-6 w-6" />
            </NavLink>
            <UserAvatar to="/rep/profile" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default RepNavbar;
