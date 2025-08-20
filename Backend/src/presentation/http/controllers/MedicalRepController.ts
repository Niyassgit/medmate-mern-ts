import { Request,Response } from "express";
import { CreateMedicalRepUseCase } from "../../../application/medicalRep/auth/CreateMedicalRepUseCase";
import { RegisterMedicalRepDTO } from "../../../domain/medicalRep/dto/RegisterMedicalRepDTO";
import { GetMedicalRepByIdUseCase } from "../../../application/medicalRep/auth/GetMedicalRepByIdUseCase"; 
import { GetMedicalRepByEmailUseCase } from "../../../application/medicalRep/auth/GetMedicalRepByEmailUseCase"; 


export class MedicalRepController{
    constructor(
        private _createMedicalRepUseCase :CreateMedicalRepUseCase,
        private _getMedicalRepByIdUseCase:GetMedicalRepByIdUseCase,
        private _getMedicalRepByEmailUseCase:GetMedicalRepByEmailUseCase
     ){}

    createMedicalRep=async(req:Request,res:Response)=>{

        try {
            const companyLogoUrl =req.file ? `/uploads/company-logo/${req.file.filename}`:null;
            const data : RegisterMedicalRepDTO ={
                ...req.body,
                companyLogoUrl
            };
            const rep =await this._createMedicalRepUseCase.execute(data);
            res.status(201).json(rep);
        } catch (error : any) {
            res.status(400).json({message:error.message})
        }
    }

    getMedicalRepByProfileId=async (req:Request,res:Response)=>{

        try {
            const rep=await this._getMedicalRepByIdUseCase.execute(req.params.id);
            if(!rep){
                res.status(404).json({message:"User not found"})
            } 
            res.status(200).json(rep);
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

    getMedicalRepByEmail=async(req:Request,res:Response)=>{

        try {
            const {email}=req.params;
            const rep=await this._getMedicalRepByEmailUseCase.execute(email);
            if(!rep){
                res.status(404).json({message:"User not found"});
            }
            res.status(200).json(rep)
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    
}