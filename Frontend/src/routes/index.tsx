import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./PublicRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { DoctorRoutes } from "./DoctorRoutes";
import { RepRoutes } from "./RepRoutes";
import { GuestRoutes } from "./GuestRoutes";


export const router=createBrowserRouter([
  ...publicRoutes,
  AdminRoutes,
  DoctorRoutes,
  RepRoutes,
  GuestRoutes
]);