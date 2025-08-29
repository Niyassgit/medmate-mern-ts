import { Router } from "express";
import { doctorController } from "../../../infrastructure/di/DoctorDI";
import { authController } from "../../../infrastructure/di/AuthDi";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { validateLogin } from "../validators/LoginValidationSchema";
import { upload } from "../../../infrastructure/storage/multer/MulterConfig";
import { RegisterDoctorSchema } from "../validators/DoctorSchemaValidator";

export class DoctorRoutes{
     public router:Router;

    constructor(){
        this.router=Router()
        this.initializeRoutes()
    }

    private initializeRoutes(){
     this.router.post("/signup",upload.single("licenseImageUrl"),ValidateSchema(RegisterDoctorSchema),doctorController.createDoctor);
     this.router.post("/login",ValidateSchema(validateLogin),authController.loginDoctor);
     this.router.get("/:id",doctorController.getDoctorProfileById);
    }
}