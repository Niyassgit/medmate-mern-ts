import { Request,Response } from "express";
import { LoginDoctorUseCase } from "../../../application/doctor/use-cases/auth/LoginDoctorUseCase"; 
import { LoginMedicalRepUseCase } from "../../../application/medicalRep/use-cases/auth/LoginMedicalRepUseCase"; 
import { LoginSuperAdminUseCase } from "../../../application/superAdmin/use-case/auth/LoginSuperAdminUseCase";

export class AuthController{

    constructor(
        private loginDoctorUseCase:LoginDoctorUseCase,
        private loginMedicalRepUseCase:LoginMedicalRepUseCase,
        private loginSuperAdmin:LoginSuperAdminUseCase
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

    loginAdmin=async(req:Request,res:Response)=>{

        try {
            const {email,password}=req.body;
            const result =await this.loginSuperAdmin.execute(email,password);
            res.status(200).json(result);
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

}