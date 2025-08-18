import { Request,Response } from "express";
import { CreateDoctorUseCase } from "../../../application/doctor/use-cases/auth/CreateDoctorUseCase";
import { GetDoctorProfileByIdUseCase } from "../../../application/doctor/use-cases/auth/GetDoctorProfileByIdUseCase"; 
import { GetDoctorProfileByEmailUseCase } from "../../../application/doctor/use-cases/auth/GetDoctorProfileByEmailUseCase"; 


export class DoctorController {
    constructor(
        private createDoctorUseCase: CreateDoctorUseCase,
        private getDoctorProfileByIdUseCase : GetDoctorProfileByIdUseCase,
        private getDoctorProfileByEmailUseCase :GetDoctorProfileByEmailUseCase
    ){}

    createDoctor= async (req:Request,res:Response)=>{
        try {
            const doctor=await this.createDoctorUseCase.execute(req.body);
            res.status(201).json(doctor);
        } catch (error :any) {
            res.status(400).json({message:error.message});
        }
    }
    getDoctorProfileById=async(req:Request,res:Response)=>{
        try {
            const doctor=await this.getDoctorProfileByIdUseCase.execute(req.params.id);

            if(!doctor){
                return res.status(404).json({message:"Doctor not found"});
            }
            res.json(doctor)
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    }
    getDoctorProfileByEmail=async(req:Request,res:Response)=>{
        
        try {
            const {email}=req.params;
            const doctor=await this.getDoctorProfileByEmailUseCase.execute(email);

            if(!doctor){
                return res.status(404).json({message:"Doctor not found"});
            }
            res.status(200).json(doctor);
        } catch (error :any) {
            res.status(400).json({message:error.message});
        }
    };

}