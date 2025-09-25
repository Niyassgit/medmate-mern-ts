import RepDashboard from "@/features/rep/pages/RepDashboard";
import PrivateRoute from "@/components/PrivateRoute";
import { Role } from "@/types/Role";
import ProfilePage from "@/features/rep/pages/ProfilePage";

export const RepRoutes={

    path:"/rep/dashboard",
    element:(
        <PrivateRoute role={Role.MEDICAL_REP}>
        <RepDashboard />
        </PrivateRoute>
    ),
    children:[
        {path:"profile",element:<ProfilePage/>}
    ]
}