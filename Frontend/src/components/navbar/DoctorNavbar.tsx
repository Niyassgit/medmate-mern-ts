import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Button } from "../ui/button";
import { Bell, Hospital, Mail, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import UserAvatar from "../shared/UserAvatar";
import {
  notificationUnreadCount,
  doctorConversations,
} from "@/features/doctor/api";
import { useAppSelector } from "@/app/hooks";
import { getSocket } from "@/lib/socket";
import { MessageDTO } from "../Dto/MessageDTO";
import { Role } from "@/types/Role";
import { Conversation } from "../Dto/Conversation";

const DoctorNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const token = useMemo(() => localStorage.getItem("accessToken"), []);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchUnread = async (id: string) => {
      const res = await notificationUnreadCount(id);
      setUnreadCount(res.data || 0);
    };
    fetchUnread(userId);
  }, [userId]);

  const updateUnreadChatCount = useCallback(async () => {
    try {
      const res = await doctorConversations();
      const totalUnread = res.data?.reduce(
        (sum: number, conv: Conversation) => sum + (conv.unread || 0),
        0
      );
      setUnreadChatCount(totalUnread);
    } catch (err) {
      console.error("Failed to fetch unread chat count", err);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setPracticeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!userId) return;
    updateUnreadChatCount();
  }, [userId, updateUnreadChatCount]);

  const navLinkClass = (isActive: boolean) =>
    `hover:text-gray-200 transition ${
      isActive ? "text-blue-600 font-semibold" : "text-white"
    }`;

  useEffect(() => {
    if (!token || !userId) return;
    const socket = getSocket(token);
    if (!socket) return;

    socket.on("notification:count", (data) => setUnreadCount(data));

    return () => {
      socket.off("notification:count");
    };
  }, [token, userId]);

  useEffect(() => {
    if (!token || !userId) return;
    const socket = getSocket(token);
    if (!socket) return;

    const joinAllConversations = async () => {
      try {
        const res = await doctorConversations();
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
      if (message.senderRole !== Role.DOCTOR) {
        setUnreadChatCount((prev) => prev + 1);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_seen", updateUnreadChatCount);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_seen", updateUnreadChatCount);
    };
  }, [token, userId, updateUnreadChatCount]);

  return (
    <nav className="bg-[#E8618C] shadow-md">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="MedMate Logo"
            className="h-18 object-contain"
          />
          <span className="font-semibold text-2xl text-white ml-2">
            MedMate
          </span>
        </div>

        {/* ---------- Desktop Links ---------- */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Main Nav */}
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

          {/* ---------- Practice Dropdown ----------
              New Dropdown for Prescriptions + Commission + Reps Products
          */}
          {/* ---------- Practice Dropdown (Click to open) ---------- */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              className="text-white hover:text-gray-200"
              onClick={() => setPracticeOpen((prev) => !prev)}
            >
              <Hospital className="h-4 w-3" /> Practice ▾
            </Button>

            {practiceOpen && (
              <div className="absolute bg-white shadow-lg rounded-md py-2 w-52 z-50">
                <NavLink
                  to="/doctor/practice/reps-products"
                  onClick={() => setPracticeOpen(false)}
                >
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Reps & Products
                  </div>
                </NavLink>

                <NavLink
                  to="/doctor/prescription"
                  onClick={() => setPracticeOpen(false)}
                >
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Create Prescription
                  </div>
                </NavLink>

                <NavLink
                  to="/doctor/prescriptions"
                  onClick={() => setPracticeOpen(false)}
                >
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Prescriptions
                  </div>
                </NavLink>

                <NavLink
                  to="/doctor/commission"
                  onClick={() => setPracticeOpen(false)}
                >
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Commission Catalogue
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          {/* Icons */}
          <NavLink to="/doctor/messages">
            {({ isActive }) => (
              <div className="relative">
                <Mail
                  className={`h-6 w-6 cursor-pointer ${navLinkClass(isActive)}`}
                />
                {unreadChatCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5">
                    {unreadChatCount > 99 ? "99+" : unreadChatCount}
                  </span>
                )}
              </div>
            )}
          </NavLink>

          <NavLink to="/doctor/notifications">
            {({ isActive }) => (
              <div className="relative">
                <Bell
                  className={`h-6 w-6 cursor-pointer ${navLinkClass(isActive)}`}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            )}
          </NavLink>

          <UserAvatar to="/doctor/profile" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* -------- Mobile Menu -------- */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-6 pb-5 mt-2 text-white">
          {/* Normal links */}
          <NavLink to="/doctor/feed" onClick={() => setMobileOpen(false)}>
            Feed
          </NavLink>
          <NavLink to="/doctor/analytics" onClick={() => setMobileOpen(false)}>
            Connections
          </NavLink>
          <NavLink to="/doctor/network" onClick={() => setMobileOpen(false)}>
            Search Network
          </NavLink>

          {/* Practice Mobile Section */}
          <div className="border-t border-white/30 pt-3">
            <span className="text-white font-semibold">Practice</span>
            <div className="ml-3 flex flex-col space-y-2 mt-2">
              <NavLink
                to="/doctor/practice/reps-products"
                onClick={() => setMobileOpen(false)}
              >
                Reps & Products
              </NavLink>
              <NavLink
                to="/doctor/prescription"
                onClick={() => setMobileOpen(false)}
              >
                Create Prescription
              </NavLink>
              <NavLink
                to="/doctor/prescriptions"
                onClick={() => setMobileOpen(false)}
              >
                Prescriptions
              </NavLink>
              <NavLink
                to="/doctor/commission"
                onClick={() => setMobileOpen(false)}
              >
                Commission Catalogue
              </NavLink>
            </div>
          </div>

          {/* Messages + Notifications + Profile */}
          <div className="flex items-center space-x-6 mt-3">
            <NavLink to="/doctor/messages" onClick={() => setMobileOpen(false)}>
              <Mail className="h-6 w-6 text-white" />
            </NavLink>
            <NavLink
              to="/doctor/notifications"
              onClick={() => setMobileOpen(false)}
            >
              <Bell className="h-6 w-6 text-white" />
            </NavLink>
            <UserAvatar to="/doctor/profile" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default DoctorNavbar;
