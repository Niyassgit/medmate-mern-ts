import { Router } from "express";
import { validateRegisterDoctorSchema } from "../validators/doctorSchemaValidator";
import { doctorController } from "../../../infrastructure/di/DoctorDI";

export class DoctorRoutes{
     public router:Router;

    constructor(){
        this.router=Router()
        this.initializeRoutes()
    }

    private initializeRoutes(){
     this.router.post("/signup",validateRegisterDoctorSchema,doctorController.createDoctor);
     this.router.get("/:id",doctorController.getDoctorProfileById);
    }
}