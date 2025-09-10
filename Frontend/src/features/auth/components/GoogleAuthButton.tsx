import { GoogleLogin } from "@react-oauth/google";
import { googelPrecheck, googleLogin } from "../api";
import { useNavigate } from "react-router-dom";
import { Role } from "@/types/Role";
import { useDispatch } from "react-redux";
import { login } from "../authSlice";
const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        console.error("No ID token recieved from Google");
        return;
      }

      const precheckRes = await googelPrecheck(idToken);

      if (precheckRes.data.exists) {
        const response = await googleLogin(idToken);

        dispatch(
          login({
            token: response.data.accessToken,
            role: response.data.user.role,
          })
        );

        if (response.data.user.role === Role.DOCTOR)
          navigate("/doctor/dashboard");
        if (response.data.user.role === Role.MEDICAL_REP)
          navigate("/rep/dashboard");
        if (response.data.user.role === Role.SUPER_ADMIN)
          navigate("/admin/dashboard");
      } else {
        console.log("ëlse");

        navigate(`selectrole?idToken=${idToken}`);
      }
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Google login Failed");
      }}
    />
  );
};

export default GoogleAuthButton;
