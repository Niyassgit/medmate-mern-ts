import { Request,Response } from "express";
import { LoginDoctorUseCase } from "../../../application/doctor/use-cases/LoginDoctorUseCase";
import { LoginMedicalRepUseCase } from "../../../application/medicalRep/LoginMedicalRepUseCase";

export class AuthController{

    constructor(
        private loginDoctorUseCase:LoginDoctorUseCase,
        private loginMedicalRepUseCase:LoginMedicalRepUseCase
    ){}


   loginDoctor=async(req:Request,res:Response)=>{

    try {
          const {email,password}=req.body;
          const result=await this.loginDoctorUseCase.execute(email,password);
          res.status(200).json(result);
    } catch (error :any) {
        res.status(400).json({message:error.message});
    }
        

    }

    loginRep=async(req:Request,res:Response)=>{
        try {
            const {email,password}=req.body;
            const result =await this.loginMedicalRepUseCase.execute(email,password);
            res.status(200).json(result);

        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

}