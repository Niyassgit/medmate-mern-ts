import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import SignupDoctor from "../features/auth/pages/SignupDoctor";
import SignupRep from "../features/auth/pages/SignupRep";

import LandingPage from "../features/landing/pages/LandingPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";


export const router=createBrowserRouter([

    {path:"/",element:<LandingPage/>},


    {path:"/login/doctor",element:<LoginPage/>},
    {path:"/login/rep",element:<LoginPage/>},


    {path:"/signup",element:<RegisterPage/>},
    {path:"/signup/doctor",element:<SignupDoctor/>},
    {path:"/signup/rep",element:<SignupRep/>},


]);