import { Request,Response } from "express";
import { CreateSuperAdminUseCase } from "../../../application/superAdmin/auth/CreateSuperAdminUseCase"; 
import { GetSuperAdminByEmailIdUseCase } from "../../../application/superAdmin/auth/GetSuperAdminByEmailIdUseCase"; 
import { RegisterSuperAdminDTO } from "../../../application/superAdmin/dto/RegisterSuperAdminDTO";

export class SuperAdminController{
    constructor(
        private _createSuperAdminUseCase:CreateSuperAdminUseCase,
        private _getSuperAdminByEmailIdUseCase:GetSuperAdminByEmailIdUseCase
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
}