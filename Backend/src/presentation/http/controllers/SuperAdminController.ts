import { Request,Response } from "express";
import { CreateSuperAdminUseCase } from "../../../application/superAdmin/auth/CreateSuperAdminUseCase"; 
import { GetSuperAdminByEmailIdUseCase } from "../../../application/superAdmin/auth/GetSuperAdminByEmailIdUseCase"; 
import { RegisterSuperAdminDTO } from "../../../application/superAdmin/dto/RegisterSuperAdminDTO";
import { GetAllDoctorsUseCase } from "../../../application/superAdmin/useCases/GetAllDoctorsUseCase";
import { GetAllRepsUseCase } from "../../../application/superAdmin/useCases/GetAllRepsUseCase";
import { success } from "zod";

export class SuperAdminController{
    constructor(
        private _createSuperAdminUseCase:CreateSuperAdminUseCase,
        private _getSuperAdminByEmailIdUseCase:GetSuperAdminByEmailIdUseCase,
        private _getAllDoctorsUseCase:GetAllDoctorsUseCase,
        private _getAllRepsUseCase:GetAllRepsUseCase
    ){}

     createSuperAdmin= async(req:Request,res:Response)=>{
              
            const SuperAdmin =await this._createSuperAdminUseCase.execute(req.body as RegisterSuperAdminDTO);
            res.status(201).json({success:true,data:SuperAdmin})
      
    }

    getSuperAdminByEmial= async (req:Request,res:Response)=>{
            
        const dto=req.body as RegisterSuperAdminDTO;
            const superAdmin=await this._getSuperAdminByEmailIdUseCase.execute(dto.email);
            res.status(200).json({success:true,data:superAdmin});
       
    }

    getAllDoctors=async (req:Request,res:Response)=>{
        
        const doctors= await this._getAllDoctorsUseCase.execute();
        res.json({success:true,data:doctors});
    }

    getAllReps=async(req:Request,res:Response)=>{
        const reps=await this._getAllRepsUseCase.execute();
        res.json({success:true,data:reps});
    }
}