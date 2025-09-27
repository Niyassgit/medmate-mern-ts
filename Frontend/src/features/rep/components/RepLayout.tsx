import { Outlet } from "react-router-dom";
import RepNavbar from "@/components/navbar/RepNavBar";
import Footer from "./Footer";




const RepLayout = () => {
  return (
       <div className="flex flex-col min-h-screen">
      <RepNavbar />


       <main className="flex-1 p-4">
        <Outlet />
      </main>
           <Footer />
    </div>
  )
}

export default RepLayout
