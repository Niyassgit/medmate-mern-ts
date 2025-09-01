import { Button } from "../ui/button"
import { Bell,Mail,Search,User} from "lucide-react"
import { Avatar,AvatarImage,AvatarFallback } from "../ui/avatar"


const DoctorNavbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 h-16 py-3 bg-[#E8618C] shadow-md">

        <div className="flex items-center ">
            <img src="/logo.png" alt="MedMate Logo" className="h-18 w-auto object-contain " />
            <span className="font-bold text-xl text-white">MedMate</span>
        </div>
        
        <div className="flex items-center space-x-6">
            <Button variant={"ghost"}  className="hover:bg-transparent hover:text-gray-300 text-white">Feed</Button>
            <Button variant={"ghost"} className="hover:bg-transparent hover:text-gray-300 text-white">Profile</Button>
            <Button variant="ghost"  className="hover:bg-transparent hover:text-gray-300 text-white">Connections</Button>
            <Button variant="ghost"  className="hover:bg-transparent hover:text-gray-300 text-white">Search Network</Button>
        </div>


        <div className="flex items-center space-x-4">
            <div className="relative">
        <input
        type="text"
        placeholder="Search..."
        className="pl-8 pr-3 py-2 w-40 sm:w-56 md:w-64 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-700 focus:border-transparent shadow-sm"
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
    </div>
            <Mail className="h-6 w-6 cursor-pointer text-white hover:text-gray-300"/>
                <Bell className="h-6 w-6 cursor-pointer text-white hover:text-gray-300"/>

                <Avatar>
                    <AvatarImage src="" alt="Doctor" />
                    <AvatarFallback >
                        <User className="h-6 w-6" />
                    </AvatarFallback>
                </Avatar>
        </div>
        </nav>
    )
}

export default DoctorNavbar
