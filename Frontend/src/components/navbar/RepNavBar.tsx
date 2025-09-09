import { Button } from "../ui/button";
import { Bell, Search,Mail } from "lucide-react";
import UserMenu from "../userMenu";

const RepNavBar = () => {

  return (
    <nav className="flex items-center justify-between px-6 h-16 py-3 bg-gray-200 shadow-md">
      <div className="flex items-center ">
        <img
          src="/logo.png"
          alt="MedMate Logo"
          className="h-18 w-auto object-contain "
        />
        <span className="font-bold text-xl ">MedMate</span>
      </div>

      <div className="flex items-center space-x-6">
        <Button variant={"ghost"} className="hover:bg-transparent">
          Dashboard
        </Button>
        <Button variant={"ghost"} className="hover:bg-transparent">
          Subscription
        </Button>
        <Button variant="ghost" className="hover:bg-transparent">
          Search Network
        </Button>
        <Button variant="ghost" className="hover:bg-transparenttext ">
          Analytics
        </Button>

        <Mail className="h-6 w-6 cursor-pointer" />
        <Bell className="h-6 w-6 cursor-pointer" />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-2 w-40 sm:w-56 md:w-64 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent shadow-sm"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>

       <UserMenu />
      </div>
    </nav>
  );
};

export default RepNavBar;
