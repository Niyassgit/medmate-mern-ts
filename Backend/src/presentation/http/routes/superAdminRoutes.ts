import { Router } from "express";
import { superAdminController } from "../../../infrastructure/di/SuperAdminDI";
import { validateSuperAdminSchema } from "../validators/SuperAdminSchemaValidator";
import { authController } from "../../../infrastructure/di/AuthDi";
import { validateLoginSchema } from "../validators/LoginValidationSchema";

export class superAdminRoutes{

    public router:Router;

    constructor(){
        this.router=Router();
        this.initializeRoutes();
    }
     private initializeRoutes(){
         this.router.post("/signup",validateSuperAdminSchema,superAdminController.createSuperAdmin);
         this.router.get("/:id",superAdminController.getSuperAdminByEmial);
         this.router.post("/login",validateLoginSchema,authController.loginAdmin);
    }
}