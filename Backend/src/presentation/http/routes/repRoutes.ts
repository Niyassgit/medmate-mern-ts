import {Router} from "express";
import { medicalRepController } from "../../../infrastructure/di/MedicalRepDI";
import { ValidateMedicalRepRegisterSchema } from "../validators/repsSchemaValidator";
import { authController } from "../../../infrastructure/di/AuthDi";
import { validateLoginSchema } from "../validators/LoginValidationSchema";
import { upload } from "../../../infrastructure/storage/multer/multerConfig";

export class MedicalRepRoutes{

    public router:Router;

    constructor(){
        this.router=Router();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post("/signup",upload.single("companyLogoUrl"),ValidateMedicalRepRegisterSchema,medicalRepController.createMedicalRep);
        this.router.get("/:id",medicalRepController.getMedicalRepByProfileId);
        this.router.post("/login",validateLoginSchema,authController.loginRep);
    }
}