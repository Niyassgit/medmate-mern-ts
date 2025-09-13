import { Request,Response } from "express";
import { CreateMedicalRepUseCase } from "../../../application/medicalRep/auth/CreateMedicalRepUseCase";
import { RegisterMedicalRepDTO } from "../../../application/medicalRep/dto/RegisterMedicalRepDTO";
import { GetMedicalRepByIdUseCase } from "../../../application/medicalRep/auth/GetMedicalRepByIdUseCase"; 
import { GetMedicalRepByEmailUseCase } from "../../../application/medicalRep/auth/GetMedicalRepByEmailUseCase"; 


export class MedicalRepController{
    constructor(
        private _createMedicalRepUseCase :CreateMedicalRepUseCase,
        private _getMedicalRepByIdUseCase:GetMedicalRepByIdUseCase,
        private _getMedicalRepByEmailUseCase:GetMedicalRepByEmailUseCase
     ){}

    createMedicalRep=async(req:Request,res:Response)=>{

       
            const companyLogoUrl =req.file ? `/uploads/company-logo/${req.file.filename}`:null;
            const data : RegisterMedicalRepDTO ={
                ...(req.body as RegisterMedicalRepDTO),
                companyLogoUrl
            };
            const response =await this._createMedicalRepUseCase.execute(data);
            res.status(201).json({success:true,...response});
    }

    getMedicalRepByProfileId=async (req:Request,res:Response)=>{

            const rep=await this._getMedicalRepByIdUseCase.execute(req.params.id);
            res.status(200).json({success:true,data:rep});
      
    }

    getMedicalRepByEmail=async(req:Request,res:Response)=>{

            const {email}=req.params;
            const rep=await this._getMedicalRepByEmailUseCase.execute(email); 
            res.status(200).json({success:true,data:rep})
      
    }

    
}