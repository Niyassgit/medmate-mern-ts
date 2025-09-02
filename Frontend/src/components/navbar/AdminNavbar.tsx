import { Avatar,AvatarImage,AvatarFallback } from "../ui/avatar"
import { User } from "lucide-react"

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-end border-b-2 border-gray-400">
          <Avatar className="rounded-full bg-gray-600 mb-2">
           <AvatarImage src="" alt="Admin"/>
           <AvatarFallback>
            <User className="w-6 h-6"/>
           </AvatarFallback>
          </Avatar>
    </div>
  )
}

export default AdminNavbar
