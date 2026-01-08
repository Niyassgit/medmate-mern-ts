import { GoogleLogin } from "@react-oauth/google";
import { googelPrecheck, googleLogin } from "../api";
import { useNavigate } from "react-router-dom";
import { Role } from "@/types/Role";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "../authSlice";
import { fetchSubscription } from "@/features/subscription/subscriptionThunks";
import toast from "react-hot-toast";
import { useEffect } from "react";

const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { accessToken, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken || !user) return;

    switch (user.role) {
      case Role.DOCTOR:
        navigate("/doctor/feed", { replace: true });
        break;
      case Role.MEDICAL_REP:
        navigate("/rep/dashboard", { replace: true });
        break;
      case Role.GUEST:
        navigate("/guest/dashboard", { replace: true });
        break;
      case Role.SUPER_ADMIN:
        navigate("/admin/dashboard", { replace: true });
        break;
      default:
        break;
    }
  }, [accessToken, user, navigate]);

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      if (accessToken && user) {
        toast.error("You are already logged in.");
        return;
      }

      const idToken = credentialResponse?.credential;

      if (!idToken) {
        toast.error("No ID token received from Google");
        return;
      }

      const precheckRes = await googelPrecheck(idToken);

      if (precheckRes.data.exists && precheckRes.data.user?.role) {
        const role = precheckRes.data.user.role;

        const response = await googleLogin(idToken, role);

        dispatch(
          login({
            token: response.data.accessToken,
            user: response.data.user,
          })
        );

        if (response.data.user.role === Role.MEDICAL_REP) {
          dispatch(fetchSubscription());
        }
        return;
      }

      navigate(`/auth/login/selectrole?idToken=${idToken}`);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Google login failed";
      toast.error(errorMessage);
    }
  };

  if (accessToken && user) {
    return null;
  }

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Google login failed")}
    />
  );
};

export default GoogleAuthButton;
