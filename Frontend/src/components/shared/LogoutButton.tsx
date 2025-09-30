import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/authSlice"; 
import { LogOut } from "lucide-react"; 

interface LogoutButtonProps {
  redirectTo?: string; 
  label?: string; 
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  redirectTo = "/login",
  label = "Logout",
  className,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    localStorage.removeItem("accessToken"); 
    localStorage.removeItem("user"); 
    navigate(redirectTo);
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut size={18} />
      {label}
    </Button>
  );
};

export default LogoutButton;
