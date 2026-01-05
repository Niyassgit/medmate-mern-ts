import { logoutUser } from "@/features/auth/api"
import { googleLogout } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { logout } from "../authSlice";
import { clearSubscription } from "@/features/subscription/subscriptionSlice";

const LogoutFn = () => {
    const navigate=useNavigate();
    const dispatch = useDispatch();
 
    const handleLogout=async()=>{
        try {
            await logoutUser();
            googleLogout();
            dispatch(logout());
            dispatch(clearSubscription());
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            navigate("/auth/login",{replace:true});
        } catch (error) {
            console.error("Logout failed", error);
        }
    }
  return {logout: handleLogout};
}

export default LogoutFn
