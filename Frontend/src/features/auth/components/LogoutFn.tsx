import { logoutUser } from "@/features/auth/api"
import { googleLogout } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"

const LogoutFn = () => {
    const navigate=useNavigate();
 
    const logout=async()=>{
        try {
            
            await logoutUser();
            googleLogout();

            localStorage.removeItem("accessToken"),
            localStorage.removeItem("role"),
            navigate("/auth/login",{replace:true});
        } catch (error) {
            console.error("Logout failed", error);
        }
    }
  return {logout};
}

export default LogoutFn
