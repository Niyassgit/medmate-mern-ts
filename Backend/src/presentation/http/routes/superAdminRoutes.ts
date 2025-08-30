import { Router } from "express";
import { superAdminController } from "../../../infrastructure/di/SuperAdminDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { SuperAdminRegisterSchema } from "../validators/SuperAdminSchemaValidator";


export class superAdminRoutes{

    public router:Router;

    constructor(){
        this.router=Router();
        this.initializeRoutes();
    }
     private initializeRoutes(){
         this.router.post("/signup",ValidateSchema(SuperAdminRegisterSchema),superAdminController.createSuperAdmin);
         this.router.get("/:id",superAdminController.getSuperAdminByEmial);
    }
}