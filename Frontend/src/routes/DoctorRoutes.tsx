import PrivateRoute from "@/components/shared/PrivateRoute";
import { Role } from "@/types/Role";
import ProfilePage from "@/features/doctor/pages/ProfilePage";
import Feed from "@/features/doctor/pages/Feed";
import Connections from "@/features/doctor/pages/Connections";
import DoctorLayout from "@/features/doctor/components/DoctorLayout";
import CompleteProfilePage from "@/features/doctor/pages/CompleteProfilePage";
import NetworkPage from "@/features/doctor/pages/NetworkPage";
import DoctorAnalyticsPage from "@/features/doctor/pages/DoctorAnalyticsPage";
import PostDetails from "@/features/doctor/pages/ProductPostDetails";
import { RepDetailsPage } from "@/features/doctor/pages/RepDetailsPage";
import Notifications from "@/features/doctor/pages/Notifications";
import ChatPage from "@/features/doctor/pages/ChatPage";
import ProductPage from "@/features/doctor/pages/ProductPage";
import PrescriptionPage from "@/features/doctor/pages/PrescriptionPage";
import ProductDetails from "@/features/doctor/pages/ProductDetails";
import CommissionCatalogue from "@/features/doctor/pages/CommissionCatalogue";
import VerifyPassword from "@/components/shared/VerifyPassword";
import ChangePassword from "@/components/shared/ChangePassword";
import { verifyPassword, changePassword } from "@/features/doctor/api";

export const DoctorRoutes = {
  path: "/doctor",
  element: (
    <PrivateRoute role={Role.DOCTOR}>
      <DoctorLayout />
    </PrivateRoute>
  ),
  children: [
    { path: "feed", element: <Feed /> },
    { path: "feed/:postId", element: <PostDetails /> },
    { path: "profile", element: <ProfilePage /> },
    { path: "profile/complete/:id", element: <CompleteProfilePage /> },
    { path: "connections", element: <Connections /> },
    { path: "network", element: <NetworkPage /> },
    { path: "analytics", element: <DoctorAnalyticsPage /> },
    { path: "rep/details/:repId", element: <RepDetailsPage /> },
    { path: "notifications", element: <Notifications /> },
    { path: "messages", element: <ChatPage /> },
    { path: "practice/reps-products", element: <ProductPage /> },
    { path: "prescription", element: <PrescriptionPage /> },
    { path: "commission", element: <CommissionCatalogue /> },
    { path: "practice/product/details", element: <ProductDetails /> },
    {
      path: "verify-password",
      element: (
        <VerifyPassword
          onVerify={verifyPassword}
          onSuccessRedirect="/doctor/change-password"
        />
      ),
    },
    {
      path: "change-password",
      element: (
        <ChangePassword
          onChangePassword={(password: string) =>
            changePassword({ role: "doctor", newPassword: password })
          }
          onSuccessRedirect="/doctor/profile"
        />
      ),
    },
  ],
};
