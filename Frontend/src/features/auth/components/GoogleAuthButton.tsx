import { GoogleLogin } from "@react-oauth/google";
import { googelPrecheck, googleLogin } from "../api";
import { useNavigate } from "react-router-dom";
import { Role } from "@/types/Role";
import { useDispatch } from "react-redux";
import { login } from "../authSlice";
import toast from "react-hot-toast";

const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        toast.error("No ID token recieved from Google");
        return;
      }

      const precheckRes = await googelPrecheck(idToken);

      if (precheckRes.data.exists && precheckRes.data.user.role) {
        const role = precheckRes.data.user.role;
        const response = await googleLogin(idToken, role);

        dispatch(
          login({
            token: response.data.accessToken,
            user: response.data.user,
          })
        );

        if (response.data.user.role === Role.DOCTOR) {
          navigate("/doctor/dashboard");
        }

        if (response.data.user.role === Role.MEDICAL_REP) {
          navigate("/rep/dashboard");
        }

        if (response.data.user.role === Role.SUPER_ADMIN) {
          console.log("user is super admin");
          navigate("/admin/dashboard");
        }
      } else {
        navigate(`selectrole?idToken=${idToken}`);
      }
    } catch (error:any) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        toast.error("Google login Failed");
      }}
    />
  );
};

export default GoogleAuthButton;
