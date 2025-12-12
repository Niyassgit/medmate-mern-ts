import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const LandingPageNavbar = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="flex items-center justify-between  bg-gradient-to-b from-[#022b4e] to-[#185891]/90 px-6 h-16 py-3  shadow-md">
      <div className="flex items-center gap-0">
        <img
          src="/logo.png"
          alt="MedMate Logo"
          className="h-18 w-auto object-contain"
        />
        <span className="font-bold text-gray-50 text-xl -ml-5 pb-4">
          MedMate
        </span>
      </div>

      <div className="flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
        <Button 
          variant={"ghost"} 
          className="hover:bg-transparent text-gray-50"
          onClick={() => navigate("/")}
        >
          Home
        </Button>
        <Button variant={"ghost"} className="hover:bg-transparent text-gray-50">
          About us
        </Button>
        <Button variant="ghost" className="hover:bg-transparent text-gray-50">
          Services
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-transparenttext text-gray-50 "
        >
          Info
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-transparenttext text-gray-50 "
          onClick={() => navigate("/guest-info")}
        >
          Guest
        </Button>
      </div>
    </nav>
  );
};

export default LandingPageNavbar;
