import PrivateRoute from "@/components/shared/PrivateRoute";
import { Role } from "@/types/Role";
import ProfilePage from "@/features/doctor/pages/ProfilePage";
import Feed from "@/features/doctor/pages/Feed";
import Connections from "@/features/doctor/pages/Connections";
import DoctorLayout from "@/features/doctor/components/DoctorLayout";
import CompleteProfilePage from "@/features/doctor/pages/CompleteProfilePage";
import NetworkPage from "@/features/doctor/pages/NetworkPage";

export const DoctorRoutes={
    path:"/doctor",
    element:(
        <PrivateRoute role={Role.DOCTOR}>
         <DoctorLayout/>
        </PrivateRoute>
    ),
    children:[
      {path:"feed",element:<Feed />},
      {path:"profile", element:<ProfilePage/>},
      {path:"profile/complete/:id",element:<CompleteProfilePage />},
      {path:"connections",element:<Connections />},
      {path:"network",element:<NetworkPage />}
    ]
};