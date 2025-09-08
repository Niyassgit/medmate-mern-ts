import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import LandingPage from "../features/landing/pages/LandingPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DoctorDashboard from "@/features/doctor/pages/DoctorDashboard";
import RepDashboard from "@/features/rep/pages/RepDashboard";
import AdminDashboard from "@/features/superAdmin/pages/AdminDashboard";
import AdminLayout from "@/features/superAdmin/pages/AdminLayout";
import RepsList from "@/features/superAdmin/pages/RepsList";
import DoctorsList from "@/features/superAdmin/pages/DoctorsList";
import UserValidation from "@/features/superAdmin/pages/UserValidation";
import PrivateRoute from "@/components/PrivateRoute";
import { Role } from "@/types/Role";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/signup", element: <RegisterPage /> },

  { path: "/auth/login", element: <LoginPage /> },

  {
    path: "/doctor/dashboard",
    element: (
      <PrivateRoute role={Role.DOCTOR}>
        <DoctorDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/rep/dashboard",
    element: (
      <PrivateRoute role={Role.MEDICAL_REP}>
        <RepDashboard />
      </PrivateRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <PrivateRoute role={Role.SUPER_ADMIN}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "user-validation", element: <UserValidation /> },
      { path: "reps", element: <RepsList /> },
      { path: "doctors", element: <DoctorsList /> },
    ],
  },
]);
