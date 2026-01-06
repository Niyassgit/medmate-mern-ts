import GuestNavbar from "@/components/navbar/GuestNavbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import GuestFooter from "./GuestFooter";
import { useEffect } from "react";
import { getProfile } from "../api";

const GuestLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      if (location.pathname === "/guest/complete-profile") return;

      try {
        const profile = await getProfile();
        if (profile && (!profile.isRegistered || profile.territoryName === "Unknown")) {
          navigate("/guest/complete-profile");
        }
      } catch (error) {
        console.error("Failed to check profile", error);
      }
    };
    checkProfile();
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1A3F] via-[#0B152F] to-black text-white pt-6">
      <GuestNavbar />

      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <GuestFooter />
    </div>
  );
};

export default GuestLayout;
