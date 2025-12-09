import GuestNavbar from "@/components/navbar/GuestNavbar";
import Footer from "@/features/landing/pages/Footer";
import React from "react";
import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1A3F] via-[#0B152F] to-black text-white">
      {/* Navbar */}
      <GuestNavbar />

      {/* Main content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default GuestLayout;
