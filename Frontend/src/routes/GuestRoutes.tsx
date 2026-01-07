import PrivateRoute from "@/components/shared/PrivateRoute";
import GuestLayout from "@/features/guest/components/GuestLayout";
import CheckoutPage from "@/features/guest/pages/CheckoutPage";
import HomePage from "@/features/guest/pages/HomePage";
import PrescriptionList from "@/features/guest/pages/Priscriptions";
import OrderSuccessPage from "@/features/guest/pages/OrderSuccessPage";
import OrderCancelPage from "@/features/guest/pages/OrderCancelPage";
import { Role } from "@/types/Role";
import OrderListingPage from "@/features/guest/pages/OrdersListPage";
import OrderDetailPage from "@/features/guest/pages/OrderDetailPage";
import ProfilePage from "@/features/guest/pages/ProfilePage";
import CompleteProfilePage from "@/features/guest/pages/CompleteProfilePage";
import { changePassword, verifyPassword } from "@/features/guest/api";
import ChangePassword from "@/components/shared/ChangePassword";
import VerifyPassword from "@/components/shared/VerifyPassword";

export const GuestRoutes = {

  path: "/guest",
  element: (
    <PrivateRoute role={Role.GUEST}>
      <GuestLayout />
    </PrivateRoute>
  ),
  children: [
    { path: "dashboard", element: <HomePage /> },
    { path: "prescriptions", element: <PrescriptionList /> },
    { path: "checkout", element: <CheckoutPage /> },
    { path: "order-success", element: <OrderSuccessPage /> },
    { path: "order-cancel", element: <OrderCancelPage /> },
    { path: "orders", element: <OrderListingPage /> },
    { path: "orders/:orderId", element: <OrderDetailPage /> },
    { path: "profile", element: <ProfilePage /> },
    { path: "complete-profile", element: <CompleteProfilePage /> },
    {
      path: "verify-password",
      element: (
        <VerifyPassword
          onVerify={verifyPassword}
          onSuccessRedirect="/guest/change-password"
        />
      ),
    },
    {
      path: "change-password",
      element: (
        <ChangePassword
          onSuccessRedirect="/guest/profile"
          onChangePassword={changePassword}
        />
      ),
    },
  ],
};
