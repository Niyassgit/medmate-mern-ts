import { api } from "@/services/api";
import { AuthResponse,ForgotPasswordResponse,GooglePrecheckBody, verifyResponse ,RegisterResponseBody } from "./types";
import { AuthEndpoints , DoctorEndpoints ,RepEndpoints} from "@/services/endpoints";

interface loginPayload {
  email: string;
  password: string;
}

export const loginUser = (values: loginPayload) => {
  return api.post<AuthResponse>(AuthEndpoints.LOGIN, values, { withCredentials: true });
};

export const refreshAccessToken=async ()=>{
  try {
    const res=await api.get(AuthEndpoints.REFRESH,{withCredentials:true});
    const {accessToken}=res.data;
    localStorage.setItem("accessToken",accessToken);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:",error);
    throw error;
  }
}

export const googelPrecheck = (idToken: string) => {
  return api.post<GooglePrecheckBody>(
    AuthEndpoints.GOOGLE_PRECHECK,
    { idToken },
    { withCredentials: true }
  );
};
export const googleLogin = (
  idToken: string,
  role?: string
) => {
  return api.post<AuthResponse>(AuthEndpoints.GOOGLE_LOGIN, { idToken, role }, { withCredentials: true });
};

export const registerDoctor = (values: FormData) => {
  return api.post<RegisterResponseBody>(DoctorEndpoints.REGISTER, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const registerRep = (values: FormData) => {
  return api.post<RegisterResponseBody>(RepEndpoints.REGISTER, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const verifyOtp=(email:string,otp:string)=>{
  return api.post<verifyResponse>(AuthEndpoints.VERIFY_OTP,{
    email,
    otp
  },{withCredentials:true});
}

export const resendOtp=(email:string)=>{
  return api.post<verifyResponse>(AuthEndpoints.RESEND_OTP,{
    email
  },{withCredentials:true});
}
export const forgotPassword=(email:string)=>{
  return api.post<ForgotPasswordResponse>(AuthEndpoints.FORGOT_PASSWORD,{email});
}
export const verifyResetPassOtp=(email:string,otp:string)=>{
  return api.post<verifyResponse>(AuthEndpoints.FORGOT_VERIFY_OTP,{
    email,
    otp
  },{withCredentials:true})
}

export const forgotPasswordResendOtp=(email:string)=>{
   return api.post<verifyResponse>(AuthEndpoints.FORGOT_RESEND_OTP,{email});
}
export const resetPassword=(email:string,otp:string,password:string)=>{
   return api.post<verifyResponse>(AuthEndpoints.RESET_PASSWORD,{
    email,
    otp,
    password
   })
}

export const logoutUser=()=>{
  return api.post(AuthEndpoints.LOGOUT,{},{withCredentials:true});
}