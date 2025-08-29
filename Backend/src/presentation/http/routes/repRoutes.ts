import {Router} from "express";
import { medicalRepController } from "../../../infrastructure/di/MedicalRepDI";
import { authController } from "../../../infrastructure/di/AuthDi";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { upload } from "../../../infrastructure/storage/multer/MulterConfig";
import { registerMedicalRepSchema } from "../validators/RepSchemaValidator";
import { validateLogin } from "../validators/LoginValidationSchema";



export class MedicalRepRoutes{

    public router:Router;

    constructor(){
        this.router=Router();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post("/signup",upload.single("companyLogoUrl"),ValidateSchema(registerMedicalRepSchema),medicalRepController.createMedicalRep);
        this.router.get("/:id",medicalRepController.getMedicalRepByProfileId);
        this.router.post("/login",ValidateSchema(validateLogin),authController.loginRep);
    }
}