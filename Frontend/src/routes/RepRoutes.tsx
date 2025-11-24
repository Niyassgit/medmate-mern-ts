import RepDashboard from "@/features/rep/pages/RepDashboard";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { Role } from "@/types/Role";
import ProfilePage from "@/features/rep/pages/ProfilePage";
import RepLayout from "@/features/rep/components/RepLayout";
import Subscription from "@/features/rep/pages/Subscription"
import Analytics from "@/features/rep/pages/Analytics";
import Notifications from "@/features/rep/pages/Notifications";
import Network from "@/features/rep/pages/Network";
import CompleteProfile from "@/features/rep/pages/CompleteProfile";
import AddPost from "@/features/rep/pages/AddPost";
import PostDetailsPage from "@/features/rep/pages/PostDetailsPage";
import PostEditPage from "@/features/rep/pages/PostEditPage";
import DoctorProfile from "@/features/rep/pages/DoctorProfile";
import RepChatPage from "@/features/rep/pages/RepChatPage";
export const RepRoutes={

    path:"/rep",
    element:(
        <PrivateRoute role={Role.MEDICAL_REP}>
          <RepLayout />
        </PrivateRoute>
    ),
    children:[
        {path:"dashboard",element:<RepDashboard />},
        {path:"dashboard/add-post",element:<AddPost />},
        {path:"dashboard/post-details/:id",element:<PostDetailsPage/>},
        {path:"post-edit/:id",element:<PostEditPage/>},
        {path:"profile",element:<ProfilePage/>},
        {path:"profile/complete/:id",element:<CompleteProfile />},
        {path:"subscription",element:<Subscription />},
        {path:"network",element :<Network />},
        {path:"analytics",element:<Analytics/>},
        {path:"message",element:<RepChatPage />},
        {path:"notification",element:<Notifications/>},
        {path:"doctor/details/:doctorId",element:<DoctorProfile />},
        {path:"notifications/post-details/:id",element:<PostDetailsPage />},

    ]
}