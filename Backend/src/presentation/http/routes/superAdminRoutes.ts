import { Router } from "express";
import { superAdminController } from "../../../infrastructure/di/SuperAdminDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { authController } from "../../../infrastructure/di/AuthDi";
import { SuperAdminRegisterSchema } from "../validators/SuperAdminSchemaValidator";
import { validateLogin } from "../validators/LoginValidationSchema";
export class superAdminRoutes{

    public router:Router;

    constructor(){
        this.router=Router();
        this.initializeRoutes();
    }
     private initializeRoutes(){
         this.router.post("/signup",ValidateSchema(SuperAdminRegisterSchema),superAdminController.createSuperAdmin);
         this.router.get("/:id",superAdminController.getSuperAdminByEmial);
         this.router.post("/login",ValidateSchema(validateLogin),authController.loginAdmin);
    }
}