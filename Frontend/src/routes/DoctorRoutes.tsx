import PrivateRoute from "@/components/shared/PrivateRoute";
import { Role } from "@/types/Role";
import ProfilePage from "@/features/doctor/pages/ProfilePage";
import Feed from "@/features/doctor/pages/Feed";
import Connections from "@/features/doctor/pages/Connections";
import Network from "@/features/rep/pages/Network";
import DoctorLayout from "@/features/doctor/components/DoctorLayout";
import CompleteProfilePage from "@/features/doctor/components/CompleteProfilePage";

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
      {path:"network",element:<Network />}
    ]
};