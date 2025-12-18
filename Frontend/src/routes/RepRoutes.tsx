import RepDashboard from "@/features/rep/pages/RepDashboard";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { Role } from "@/types/Role";
import ProfilePage from "@/features/rep/pages/ProfilePage";
import RepLayout from "@/features/rep/components/RepLayout";
import Subscription from "@/features/rep/pages/Subscription";
import Analytics from "@/features/rep/pages/Analytics";
import Notifications from "@/features/rep/pages/Notifications";
import Network from "@/features/rep/pages/Network";
import CompleteProfile from "@/features/rep/pages/CompleteProfile";
import AddPost from "@/features/rep/pages/AddPost";
import PostDetailsPage from "@/features/rep/pages/PostDetailsPage";
import PostEditPage from "@/features/rep/pages/PostEditPage";
import DoctorProfile from "@/features/rep/pages/DoctorProfile";
import RepChatPage from "@/features/rep/pages/RepChatPage";
import SubscriptionSuccess from "@/features/rep/components/SubscriptionSuccess";
import SubscriptionCancel from "@/features/rep/components/SubscriptionCancel";
import Orders from "@/features/rep/pages/Orders";
import Product from "@/features/rep/pages/Product";
import ProductAddForm from "@/features/rep/components/ProductAddForm";
import EditProductPage from "@/features/rep/components/EditProductPage";
import VerifyPassword from "@/components/shared/VerifyPassword";
import ChangePassword from "@/components/shared/ChangePassword";
import { changePassword, verifyPassword } from "@/features/rep/api";
import OrderDetailsPage from "@/features/rep/pages/OrderDetailsPage";
export const RepRoutes = {
  path: "/rep",
  element: (
    <PrivateRoute role={Role.MEDICAL_REP}>
      <RepLayout />
    </PrivateRoute>
  ),
  children: [
    { path: "dashboard", element: <RepDashboard /> },
    { path: "dashboard/add-post", element: <AddPost /> },
    { path: "dashboard/post-details/:id", element: <PostDetailsPage /> },
    { path: "post-edit/:id", element: <PostEditPage /> },
    { path: "profile", element: <ProfilePage /> },
    { path: "profile/complete/:id", element: <CompleteProfile /> },
    { path: "subscription", element: <Subscription /> },
    { path: "network", element: <Network /> },
    { path: "analytics", element: <Analytics /> },
    { path: "message", element: <RepChatPage /> },
    { path: "notification", element: <Notifications /> },
    { path: "doctor/details/:doctorId", element: <DoctorProfile /> },
    { path: "notifications/post-details/:id", element: <PostDetailsPage /> },
    { path: "subscription-success", element: <SubscriptionSuccess /> },
    { path: "subscription-cancel", element: <SubscriptionCancel /> },
    { path: "business/orders", element: <Orders /> },
    { path: "business/orders/:orderId", element: <OrderDetailsPage /> },
    { path: "business/products", element: <Product /> },
    { path: "business/product/upload", element: <ProductAddForm /> },
    { path: "business/product/edit-product", element: <EditProductPage /> },
    {
      path: "verify-password",
      element: (
        <VerifyPassword
          onVerify={verifyPassword}
          onSuccessRedirect="/rep/change-password"
        />
      ),
    },
    {
      path: "change-password",
      element: (
        <ChangePassword
          onChangePassword={(pwd) => changePassword(pwd, Role.MEDICAL_REP)}
          onSuccessRedirect="/rep/profile"
        />
      ),
    },
  ],
};
