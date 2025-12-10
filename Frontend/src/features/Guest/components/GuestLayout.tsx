import GuestNavbar from "@/components/navbar/GuestNavbar";
import { Outlet } from "react-router-dom";
import GuestFooter from "./GuestFooter";

const GuestLayout = () => {
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
