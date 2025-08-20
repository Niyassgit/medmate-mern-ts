import { Request,Response } from "express";
import { LoginDoctorUseCase } from "../../../application/doctor/auth/LoginDoctorUseCase"; 
import { LoginMedicalRepUseCase } from "../../../application/medicalRep/auth/LoginMedicalRepUseCase"; 
import { LoginSuperAdminUseCase } from "../../../application/superAdmin/auth/LoginSuperAdminUseCase";

export class AuthController{

    constructor(
        private _loginDoctorUseCase:LoginDoctorUseCase,
        private _loginMedicalRepUseCase:LoginMedicalRepUseCase,
        private _loginSuperAdmin:LoginSuperAdminUseCase
    ){}


   loginDoctor=async(req:Request,res:Response)=>{

    try {
          const {email,password}=req.body;
          const result=await this._loginDoctorUseCase.execute(email,password);
          res.status(200).json(result);
    } catch (error :any) {
        res.status(400).json({message:error.message});
    }
        

    }

    loginRep=async(req:Request,res:Response)=>{
        try {
            const {email,password}=req.body;
            const result =await this._loginMedicalRepUseCase.execute(email,password);
            res.status(200).json(result);

        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    loginAdmin=async(req:Request,res:Response)=>{

        try {
            const {email,password}=req.body;
            const result =await this._loginSuperAdmin.execute(email,password);
            res.status(200).json(result);
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

}