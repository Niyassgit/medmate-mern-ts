import { Request,Response } from "express";
import { LoginDoctorUseCase } from "../../../application/doctor/auth/LoginDoctorUseCase"; 
import { LoginMedicalRepUseCase } from "../../../application/medicalRep/auth/LoginMedicalRepUseCase"; 
import { LoginSuperAdminUseCase } from "../../../application/superAdmin/auth/LoginSuperAdminUseCase";
import { LoginRequestBody } from "../validators/LoginValidationSchema";

export class AuthController{

    constructor(
        private _loginDoctorUseCase:LoginDoctorUseCase,
        private _loginMedicalRepUseCase:LoginMedicalRepUseCase,
        private _loginSuperAdmin:LoginSuperAdminUseCase
    ){}


   loginDoctor=async(req:Request,res:Response)=>{


          const {email,password}=req.body as LoginRequestBody;
          const result=await this._loginDoctorUseCase.execute(email,password);  
          res.status(200).json({success:true,data:result});
        

    }

    loginRep=async(req:Request,res:Response)=>{
 
            const {email,password}=req.body as LoginRequestBody;
            const result =await this._loginMedicalRepUseCase.execute(email,password);
            res.status(200).json({success:true,data:result});
    
    }

    loginAdmin=async(req:Request,res:Response)=>{


            const {email,password}=req.body as LoginRequestBody;
            const result =await this._loginSuperAdmin.execute(email,password);
            res.status(200).json({success:true,data:result});
    }

}


