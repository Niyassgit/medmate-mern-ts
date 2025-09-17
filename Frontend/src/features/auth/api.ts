import { api } from "@/services/api";
import { AuthResponse,ForgotPasswordResponse,GooglePrecheckBody, verifyResponse ,RegisterResponseBody } from "./types";


interface loginPayload {
  email: string;
  password: string;
}

export const loginUser = (values: loginPayload) => {
  return api.post<AuthResponse>("/auth/login", values, { withCredentials: true });
};

export const refreshAccessToken=async ()=>{
  try {
    const res=await api.get("/auth/refresh",{withCredentials:true});
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
    "/auth/google/precheck",
    { idToken },
    { withCredentials: true }
  );
};
export const googleLogin = (
  idToken: string,
  role?: string
) => {
  return api.post<AuthResponse>("/auth/google", { idToken, role }, { withCredentials: true });
};

export const registerDoctor = (values: FormData) => {
  return api.post<RegisterResponseBody>("/doctor/signup", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const registerRep = (values: FormData) => {
  return api.post<RegisterResponseBody>("/rep/signup", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const verifyOtp=(email:string,otp:string)=>{
  return api.post<verifyResponse>("/auth/verifyotp",{
    email,
    otp
  },{withCredentials:true});
}

export const resendOtp=(email:string)=>{
  return api.post<verifyResponse>("/auth/resendotp",{
    email
  },{withCredentials:true});
}
export const forgotPassword=(email:string)=>{
  return api.post<ForgotPasswordResponse>("/auth/forgotpassword",{email});
}
export const verifyResetPassOtp=(email:string,otp:string)=>{
  return api.post<verifyResponse>("/auth/forgotpassword/verifyotp",{
    email,
    otp
  },{withCredentials:true})
}

export const forgotPasswordResendOtp=(email:string)=>{
   return api.post<verifyResponse>("/auth/forgotpassword/resendotp",{email});
}
export const resetPassword=(email:string,otp:string,password:string)=>{
   return api.post<verifyResponse>("/auth/forgotpassword/reset",{
    email,
    otp,
    password
   })
}

export const logoutUser=()=>{
  return api.post("/auth/logout",{},{withCredentials:true});
}