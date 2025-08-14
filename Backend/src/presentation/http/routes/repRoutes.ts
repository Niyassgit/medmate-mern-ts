import {Router} from "express";
import {medicalRepController} from "../../../infrastructure/di/MedicalRepDI";
import { validateMedicalRepRegisterSchema } from "../validators/repsSchemaValidator";


export class MedicalRepRoutes{

    public router:Router;

    constructor(){
        this.router=Router();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post("/signup",validateMedicalRepRegisterSchema,medicalRepController.createMedicalRep);
        this.router.get("/:id",medicalRepController.getMedicalRepByProfileId);
    }
}