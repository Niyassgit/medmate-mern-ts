import { Request, Response } from "express";
import { CreateMedicalRepUseCase } from "../../../application/medicalRep/auth/CreateMedicalRepUseCase";
import { RegisterMedicalRepDTO } from "../../../application/medicalRep/dto/RegisterMedicalRepDTO";
import { GetRepProfileByIdUseCase } from "../../../application/medicalRep/use-cases/GetRepProfileByIdUseCase";
import { ProfileImageUpdateUseCase } from "../../../application/medicalRep/use-cases/ProfileImageUpdateUseCase";


export class MedicalRepController {
  constructor(
    private _createMedicalRepUseCase: CreateMedicalRepUseCase,
    private _getUserProfile:GetRepProfileByIdUseCase,
    private _ProfileImageUpdateUseCase:ProfileImageUpdateUseCase
  ) {}

  createMedicalRep = async (req: Request, res: Response) => {
    const companyLogoUrl = req.file
      ? `/uploads/company-logo/${req.file.filename}`
      : null;
    const data: RegisterMedicalRepDTO = {
      ...(req.body as RegisterMedicalRepDTO),
      companyLogoUrl,
    };
    const response = await this._createMedicalRepUseCase.execute(data);
    res.status(201).json({ success: true, ...response });
  };
  getRepProfileById=async(req:Request,res:Response)=>{
    const {userId}=req.params;
    const response=await this._getUserProfile.execute(userId);
    return res.json({success:true,data:response});
  }
  updateProfileImage=async(req:Request,res:Response)=>{
    const {userId}=req.params;
    const file=req.file ? req.file:null;
    const response=await this._ProfileImageUpdateUseCase.execute(userId,file);
    return res.json({success:true,message:response});
  }
}
