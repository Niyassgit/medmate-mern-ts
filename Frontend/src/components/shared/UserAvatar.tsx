import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link,useLocation } from "react-router-dom";

interface UserAvatarProps {
  to: string; 
}
const UserAvatar = ({to}:UserAvatarProps) => {
    const user=useSelector((state: { auth: { user?: { image?: string; email?: string } } })=>state.auth.user);
    const location=useLocation();
    const isActive=location.pathname===to
  return (
    <Link 
    to={to}>
        <Avatar
        className={`cursor-pointer border-2 ${isActive ? 'border-blue-500' : 'border-transparent'}`}>
            {user?.image ?(
                <AvatarImage src={user.image}/>
            ):(
                <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
            )}
        </Avatar>
    </Link>
  )
}

export default UserAvatar