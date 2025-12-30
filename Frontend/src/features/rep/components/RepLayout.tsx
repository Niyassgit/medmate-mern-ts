import { Outlet } from "react-router-dom";
import RepNavbar from "@/components/navbar/RepNavBar";
import Footer from "./Footer";
import { useSubscriptionInit } from "@/hooks/useSubscriptionInit";

const RepLayout = () => {
  // Initialize subscription data when rep layout loads
  useSubscriptionInit();

  return (
    <div className="flex flex-col min-h-screen">
      <RepNavbar />

      <main className="flex-1 w-full h-full p-0 m-0">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RepLayout;
