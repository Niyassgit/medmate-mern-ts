import PrivateRoute from "@/components/shared/PrivateRoute";
import GuestLayout from "@/features/Guest/components/GuestLayout";
import HomePage from "@/features/Guest/pages/HomePage";
import { Role } from "@/types/Role";

export const GuestRoutes = {
  path: "/guest",
  element: (
    <PrivateRoute role={Role.GUEST}>
      <GuestLayout />
    </PrivateRoute>
  ),
  children: [{ path: "dashboard", element: <HomePage /> }],
};
