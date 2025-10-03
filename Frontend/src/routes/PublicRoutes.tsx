import LandingPage from "@/features/landing/pages/LandingPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import SelectRolePage from "@/features/auth/components/SelectRole";
import OtpPage from "@/features/auth/components/OtpPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword from "@/features/auth/pages/ResetPassword";

export const publicRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/register/:type", element: <RegisterPage /> },
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/auth/login/selectrole", element: <SelectRolePage /> },
  { path: "/verifyotp", element: <OtpPage /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/forgotpassword/verifyotp", element: <OtpPage /> },
  { path: "/forgotpassword/reset", element: <ResetPassword /> },
];