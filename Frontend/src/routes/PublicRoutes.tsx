import LandingPage from "@/features/landing/pages/LandingPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import SelectRolePage from "@/features/auth/components/SelectRole";
import OtpPage from "@/features/auth/components/OtpPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import GuestInfoPage from "@/features/landing/pages/GuestInfoPage";
import LoginGuest from "@/features/auth/pages/LoginGuest";
import SignupGuest from "@/features/auth/pages/SignupGuest";

export const publicRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/guest-info", element: <GuestInfoPage /> },
  { path: "/register/:type", element: <RegisterPage /> },
  { path: "/register/guest", element: <SignupGuest /> },
   { path: "/register/guest/:shareToken", element: <SignupGuest /> },
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/auth/login/guest", element: <LoginGuest /> },
  { path: "/auth/login/selectrole", element: <SelectRolePage /> },
  { path: "/verifyotp", element: <OtpPage /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/forgotpassword/verifyotp", element: <OtpPage /> },
  { path: "/forgotpassword/reset", element: <ResetPassword /> },
];