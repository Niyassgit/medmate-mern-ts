import { Request,Response } from "express";
import { CreateSuperAdminUseCase } from "../../../application/superAdmin/use-case/auth/CreateSuperAdminUseCase"; 
import { GetSuperAdminByEmailIdUseCase } from "../../../application/superAdmin/use-case/auth/GetSuperAdminByEmailIdUseCase"; 


export class SuperAdminController{
    constructor(
        private createSuperAdminUseCase:CreateSuperAdminUseCase,
        private getSuperAdminByEmailIdUseCase:GetSuperAdminByEmailIdUseCase
    ){}

     createSuperAdmin= async(req:Request,res:Response)=>{
        try {
            const SuperAdmin =await this.createSuperAdminUseCase.execute(req.body);
            res.status(201).json(SuperAdmin)
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    getSuperAdminByEmial= async (req:Request,res:Response)=>{
        try {
            const superAdmin=await this.getSuperAdminByEmailIdUseCase.execute(req.body.email);
            res.status(200).json(superAdmin);
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    }
}