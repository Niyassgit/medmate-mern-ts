import DoctorDashboard from "@/features/doctor/pages/DoctorDashboard";
import PrivateRoute from "@/components/PrivateRoute";
import { Role } from "@/types/Role";

export const DoctorRoutes={
    path:"/doctor/dashboard",
    element:(
        <PrivateRoute role={Role.DOCTOR}>
          <DoctorDashboard />
        </PrivateRoute>
    ),
};