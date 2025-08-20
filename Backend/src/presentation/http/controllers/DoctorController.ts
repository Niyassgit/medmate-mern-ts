import { Request,Response } from "express";
import { CreateDoctorUseCase } from "../../../application/doctor/auth/CreateDoctorUseCase";
import { GetDoctorProfileByIdUseCase } from "../../../application/doctor/auth/GetDoctorProfileByIdUseCase"; 
import { GetDoctorProfileByEmailUseCase } from "../../../application/doctor/auth/GetDoctorProfileByEmailUseCase"; 


export class DoctorController {
    constructor(
        private _createDoctorUseCase: CreateDoctorUseCase,
        private _getDoctorProfileByIdUseCase : GetDoctorProfileByIdUseCase,
        private _getDoctorProfileByEmailUseCase :GetDoctorProfileByEmailUseCase
    ){}

    createDoctor= async (req:Request,res:Response)=>{
        try {
            const licenseImageUrl=req.file?`/uploads/licenses/${req.file.filename}`:null;
            const doctor=await this._createDoctorUseCase.execute({
                ...req.body,
                licenseImageUrl
            });
            res.status(201).json(doctor);
        } catch (error :any) {
            res.status(400).json({message:error.message});
        }
    }
    getDoctorProfileById=async(req:Request,res:Response)=>{
        try {
            const doctor=await this._getDoctorProfileByIdUseCase.execute(req.params.id);

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
            const doctor=await this._getDoctorProfileByEmailUseCase.execute(email);

            if(!doctor){
                return res.status(404).json({message:"Doctor not found"});
            }
            res.status(200).json(doctor);
        } catch (error :any) {
            res.status(400).json({message:error.message});
        }
    };

}