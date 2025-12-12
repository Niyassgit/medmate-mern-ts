import DoctorNavbar from "@/components/navbar/DoctorNavbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const DoctorLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <DoctorNavbar />

      {/* Main content */}
      <main className="flex-1 w-full h-full p-0 m-0">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DoctorLayout;
