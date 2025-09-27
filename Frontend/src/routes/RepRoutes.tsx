import RepDashboard from "@/features/rep/pages/RepDashboard";
import PrivateRoute from "@/components/PrivateRoute";
import { Role } from "@/types/Role";
import ProfilePage from "@/features/rep/pages/ProfilePage";
import RepLayout from "@/features/rep/components/RepLayout";
import Subscription from "@/features/rep/pages/Subscription"
import Analytics from "@/features/rep/pages/Analytics";
import Messages from "@/features/rep/pages/Messages";
import Notifications from "@/features/rep/pages/Notifications";
import Network from "@/features/rep/pages/Network";

export const RepRoutes={

    path:"/rep",
    element:(
        <PrivateRoute role={Role.MEDICAL_REP}>
          <RepLayout />
        </PrivateRoute>
    ),
    children:[
        {path:"dashboard",element:<RepDashboard />},
        {path:"profile",element:<ProfilePage/>},
        {path:"subscription",element:<Subscription />},
        {path:"network",element :<Network />},
        {path:"analytics",element:<Analytics/>},
        {path:"message",element:<Messages />},
        {path:"notification",element:<Notifications/>}

    ]
}