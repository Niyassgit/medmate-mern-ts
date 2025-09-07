import { Router } from "express";
import { doctorController } from "../../../infrastructure/di/DoctorDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { upload } from "../../../infrastructure/storage/multer/MulterConfig";
import { RegisterDoctorSchema } from "../validators/DoctorSchemaValidator";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";

export class DoctorRoutes{
     public router:Router;

    constructor(){  
        this.router=Router()
        this.initializeRoutes()
    }

    private initializeRoutes(){
     this.router.post("/signup",upload.single("licenseImageUrl"),ValidateSchema(RegisterDoctorSchema),doctorController.createDoctor);
     this.router.get("/:id",Authenticate,AuthorizeRole(["DOCTOR"]),doctorController.getDoctorProfileById);
    }
}