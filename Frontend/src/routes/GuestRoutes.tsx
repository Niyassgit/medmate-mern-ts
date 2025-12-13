import PrivateRoute from "@/components/shared/PrivateRoute";
import GuestLayout from "@/features/Guest/components/GuestLayout";
import CheckoutPage from "@/features/Guest/pages/CheckoutPage";
import HomePage from "@/features/Guest/pages/HomePage";
import PrescriptionList from "@/features/Guest/pages/Priscriptions";
import OrderSuccessPage from "@/features/Guest/pages/OrderSuccessPage";
import OrderCancelPage from "@/features/Guest/pages/OrderCancelPage";
import { Role } from "@/types/Role";
import OrderListingPage from "@/features/Guest/pages/OrdersListPage";

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
  ],
};
