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
      // Avoid checking on the complete-profile page itself to prevent loop
      if (location.pathname === "/guest/complete-profile") return;

      try {
        const profile = await getProfile();
        // Check if profile is incomplete (not registered or territory unknown)
        // Adjust condition based on what "incomplete" means. 
        // Mapper returns territoryName="Unknown" and isRegistered=false for user-fallback.
        if (profile && (!profile.isRegistered || profile.territoryName === "Unknown")) {
          navigate("/guest/complete-profile");
        }
      } catch (error) {
        console.error("Failed to check profile", error);
        // Do not block access if check fails, or handle appropriately
      }
    };
    checkProfile();
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1A3F] via-[#0B152F] to-black text-white pt-6">
      {/* Navbar */}
      <GuestNavbar />

      {/* Main content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <GuestFooter />
    </div>
  );
};

export default GuestLayout;
