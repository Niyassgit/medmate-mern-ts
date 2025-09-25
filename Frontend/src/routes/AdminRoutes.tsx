import AdminLayout from "@/features/superAdmin/pages/AdminLayout";
import AdminDashboard from "@/features/superAdmin/pages/AdminDashboard";
import RepsList from "@/features/superAdmin/pages/RepsList";
import DoctorsList from "@/features/superAdmin/pages/DoctorsList";
import UserValidation from "@/features/superAdmin/pages/UserValidation";
import RepDetails from "@/features/superAdmin/pages/RepDetails";
import DoctorDetails from "@/features/superAdmin/pages/DoctorDetails";
import PrivateRoute from "@/components/PrivateRoute";
import { Role } from "@/types/Role";

export const AdminRoutes = {
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
    { path: "reps/:id", element: <RepDetails /> },
    { path: "doctors", element: <DoctorsList /> },
    { path: "doctors/:id", element: <DoctorDetails /> },
  ],
};
