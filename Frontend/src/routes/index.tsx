import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage"
import LandingPage from "../features/landing/pages/LandingPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DoctorDashboard from "@/features/doctor/pages/DoctorDashboard";
import RepDashboard from "@/features/rep/pages/RepDashboard";


export const router=createBrowserRouter([

    {path:"/",element:<LandingPage/>},
    {path:"/signup",element:<RegisterPage/>},

    {path:"/auth/login",element:<LoginPage/>},

     
     
    {path:"/doctor/dashboard",element:<DoctorDashboard/>},
     {path:"/rep/dashboard",element:<RepDashboard/>},
 
   

]);