import { Request,Response } from "express";
import { CreateSuperAdminUseCase } from "../../../application/superAdmin/auth/CreateSuperAdminUseCase"; 
import { GetSuperAdminByEmailIdUseCase } from "../../../application/superAdmin/auth/GetSuperAdminByEmailIdUseCase"; 


export class SuperAdminController{
    constructor(
        private _createSuperAdminUseCase:CreateSuperAdminUseCase,
        private _getSuperAdminByEmailIdUseCase:GetSuperAdminByEmailIdUseCase
    ){}

     createSuperAdmin= async(req:Request,res:Response)=>{
        try {
            const SuperAdmin =await this._createSuperAdminUseCase.execute(req.body);
            res.status(201).json(SuperAdmin)
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    getSuperAdminByEmial= async (req:Request,res:Response)=>{
        try {
            const superAdmin=await this._getSuperAdminByEmailIdUseCase.execute(req.body.email);
            res.status(200).json(superAdmin);
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    }
}