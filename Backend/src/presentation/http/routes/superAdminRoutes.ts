import { Router } from "express";
import { superAdminController } from "../../../infrastructure/di/SuperAdminDI";
import { validateSuperAdminSchema } from "../validators/superAdminSchemaValidator";

export class superAdminRoutes{

    public router:Router;

    constructor(){
        this.router=Router();
        this.initializeRoutes();
    }
     private initializeRoutes(){
         this.router.post("/signup",validateSuperAdminSchema,superAdminController.createSuperAdmin);
         this.router.get("/:id",superAdminController.getSuperAdminByEmial);
    }
}