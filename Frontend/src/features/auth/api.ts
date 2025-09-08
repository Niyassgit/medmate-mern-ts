import { api } from "@/services/api";
import { AuthResponse,GooglePrecheckBody } from "./types";

interface loginPayload {
  email: string;
  password: string;
}

export const loginUser = (values: loginPayload) => {
  return api.post<AuthResponse>("/auth/login", values, { withCredentials: true });
};

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
  return api.post("/doctor/signup", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const registerRep = (values: FormData) => {
  return api.post("/rep/signup", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
