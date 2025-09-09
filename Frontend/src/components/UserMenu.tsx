import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoutFn from "@/features/auth/components/LogoutFn";

interface UserMenuProps {
  profilePath?: string; 
  avatarUrl?: string; 
  fallbackIcon?: React.ReactNode; 
  showLabel?: boolean;  
}

const UserMenu = ({
  profilePath = "/profile",
  avatarUrl = "",
  fallbackIcon = <User className="h-6 w-6" />,
  showLabel = true,
}: UserMenuProps) => {
  const { logout } = LogoutFn();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={avatarUrl} alt="User Avatar" />
          <AvatarFallback>{fallbackIcon}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        {showLabel && <DropdownMenuLabel>My Account</DropdownMenuLabel>}
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate(profilePath)}>
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={logout}
          className="text-red-600 focus:text-red-700"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
