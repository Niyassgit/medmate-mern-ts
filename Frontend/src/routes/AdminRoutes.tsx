import AdminLayout from "@/features/superAdmin/components/AdminLayout";
import AdminDashboard from "@/features/superAdmin/pages/AdminDashboard";
import RepsList from "@/features/superAdmin/pages/RepsList";
import DoctorsList from "@/features/superAdmin/pages/DoctorsList";
import UserValidation from "@/features/superAdmin/pages/UserValidation";
import RepDetails from "@/features/superAdmin/pages/RepDetails";
import DoctorDetails from "@/features/superAdmin/pages/DoctorDetails";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { Role } from "@/types/Role";
import TerritorryManagement from "@/features/superAdmin/pages/TerritorryManagement";
import AddTerritory from "@/features/superAdmin/pages/AddTerritory";
import DepartmentManagement from "@/features/superAdmin/pages/DepartmentManagement";
import CreateDepartment from "@/features/superAdmin/pages/CreateDepartment";
import SubscriptionManagement from "@/features/superAdmin/pages/SubscriptionManagement";
import SubscriptionsList from "@/features/superAdmin/pages/SubscriptionsList";

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
    { path: "territories", element: <TerritorryManagement /> },
    { path: "territories/form", element: <AddTerritory /> },
    { path: "departments", element: <DepartmentManagement /> },
    { path: "departments/form", element: <CreateDepartment /> },
    { path: "subscription-management", element: <SubscriptionManagement /> },
    {path:"subscription-management/list",element:<SubscriptionsList/>}
  ],
};
