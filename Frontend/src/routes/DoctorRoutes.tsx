import DoctorDashboard from "@/features/doctor/pages/DoctorDashboard";
import PrivateRoute from "@/components/PrivateRoute";
import { Role } from "@/types/Role";
import ProfilePage from "@/features/doctor/pages/ProfilePage";

export const DoctorRoutes={
    path:"/doctor/dashboard",
    element:(
        <PrivateRoute role={Role.DOCTOR}>
          <DoctorDashboard />
        </PrivateRoute>
    ),
    children:[
      {path:"profile", element:<ProfilePage/>}
    ]
};