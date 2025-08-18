import { Request,Response } from "express";
import { CreateMedicalRepUseCase } from "../../../application/medicalRep/use-cases/auth/CreateMedicalRepUseCase";
import { RegisterMedicalRepDTO } from "../../../domain/medicalRep/dto/RegisterMedicalRepDTO";
import { GetMedicalRepByIdUseCase } from "../../../application/medicalRep/use-cases/auth/GetMedicalRepByIdUseCase"; 
import { GetMedicalRepByEmailUseCase } from "../../../application/medicalRep/use-cases/auth/GetMedicalRepByEmailUseCase"; 


export class MedicalRepController{
    constructor(
        private createMedicalRepUseCase :CreateMedicalRepUseCase,
        private getMedicalRepByIdUseCase:GetMedicalRepByIdUseCase,
        private getMedicalRepByEmailUseCase:GetMedicalRepByEmailUseCase
     ){}

    createMedicalRep=async(req:Request,res:Response)=>{

        try {
            const data : RegisterMedicalRepDTO =req.body;
            const rep =await this.createMedicalRepUseCase.execute(data);
            res.status(201).json(rep);
        } catch (error : any) {
            res.status(400).json({message:error.message})
        }
    }

    getMedicalRepByProfileId=async (req:Request,res:Response)=>{

        try {
            const rep=await this.getMedicalRepByIdUseCase.execute(req.params.id);
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
            const rep=await this.getMedicalRepByEmailUseCase.execute(email);
            if(!rep){
                res.status(404).json({message:"User not found"});
            }
            res.status(200).json(rep)
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    
}