import { Router } from "express";
import { authController } from "../../../infrastructure/di/AuthDi";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { validateLogin } from "../validators/LoginValidationSchema";


export class LoginRoute{
     public router:Router;
     constructor(){
        this.router=Router();
        this.initializeRoute()
     }

     initializeRoute(){

        this.router.post("/login",ValidateSchema(validateLogin),authController.loginUser);
        this.router.get("/refresh",authController.refreshToken)
        this.router.post("/google/precheck",authController.googlePrecheck);
        this.router.post("/google",authController.googleLogin);
     }
} 