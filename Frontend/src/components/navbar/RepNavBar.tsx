import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Bell, Mail, Menu, X } from "lucide-react";
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
    socket.on("notification:count", (data) => {
      setUnreadCount(data);
    });
    return () => {
      socket.off("notification:count");
    };
  }, [token, userId]);

  useEffect(() => {
    if (!token || !userId) return;
    const socket = getSocket(token);

    const joinAllConversations = async () => {
      try {
        const res = await repConversations();
        const conversations = res.data || [];

        conversations.forEach((conv: Conversation) => {
          socket.emit("join_conversation", conv.id);
        });
      } catch (error) {
        console.error("Failed to join conversations", error);
      }
    };

    if (socket.connected) {
      joinAllConversations();
    } else {
      socket.once("connect", joinAllConversations);
    }

    const handleNewMessage = (message: MessageDTO) => {
      if (message.senderRole !== Role.MEDICAL_REP) {
        setUnreadChatCount((prev) => prev + 1);
      }
    };

    const handleMessageSeen = (conversationId: string) => {
      updateUnreadChatCount();
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_seen", handleMessageSeen);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_seen", handleMessageSeen);
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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {[
            { label: "Dashboard", to: "/rep/dashboard" },
            { label: "Subscription", to: "/rep/subscription" },
            { label: "Search Network", to: "/rep/network" },
            { label: "Analytics", to: "/rep/analytics" },
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
        </div>

        {/* Avatar */}
        <div className="hidden md:flex">
          <UserAvatar to="/rep/profile" />
        </div>

        {/* Mobile menu icon */}
        <button
          className="md:hidden block"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-6 pb-4">
          {[
            { label: "Dashboard", to: "/rep/dashboard" },
            { label: "Subscription", to: "/rep/subscription" },
            { label: "Search Network", to: "/rep/network" },
            { label: "Analytics", to: "/rep/analytics" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={() => setMobileOpen(false)}
            >
              {({ isActive }) => (
                <span className={`block font-medium ${navLinkClass(isActive)}`}>
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}

          <div className="flex items-center space-x-6">
            <NavLink to="/rep/message" onClick={() => setMobileOpen(false)}>
              {({ isActive }) => (
                <div className="relative w-fit">
                  <Mail
                    className={`${navLinkClass(
                      isActive
                    )} h-6 w-6 cursor-pointer`}
                  />
                  {unreadChatCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-[1px]">
                      {unreadChatCount > 99 ? "99+" : unreadChatCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>

            <NavLink
              to="/rep/notification"
              onClick={() => setMobileOpen(false)}
            >
              {({ isActive }) => (
                <div className="relative w-fit">
                  <Bell
                    className={`${navLinkClass(
                      isActive
                    )} h-6 w-6 cursor-pointer`}
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
        </div>
      )}
    </nav>
  );
};

export default RepNavbar;
