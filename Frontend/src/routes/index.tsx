import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "@/components/PrivateRoute";

import LoginPage from "../features/auth/pages/LoginPage"
import LandingPage from "../features/landing/pages/LandingPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DoctorDashboard from "@/features/doctor/pages/DoctorDashboard";
import RepDashboard from "@/features/rep/pages/RepDashboard";


export const router=createBrowserRouter([

    {path:"/",element:<LandingPage/>},
    {path:"/signup",element:<RegisterPage/>},

    {path:"/login/doctor",element:<LoginPage/>},
    {path:"/login/rep",element:<LoginPage/>},
     
    {path:"/doctor/dashboard",element:<PrivateRoute role="DOCTOR"><DoctorDashboard/></PrivateRoute>},
    {path:"/rep/dashboard",element:<PrivateRoute role="MEDICAL_REP"><RepDashboard/></PrivateRoute>}
 
   

]);