import { Request, Response } from "express";
import { CreateMedicalRepUseCase } from "../../../application/medicalRep/auth/CreateMedicalRepUseCase";
import { RegisterMedicalRepDTO } from "../../../application/medicalRep/dto/RegisterMedicalRepDTO";
import { GetRepProfileByIdUseCase } from "../../../application/medicalRep/use-cases/GetRepProfileByIdUseCase";
import { ProfileImageUpdateUseCase } from "../../../application/medicalRep/use-cases/ProfileImageUpdateUseCase";
import { CompleteRepProfileDTO } from "../../../application/medicalRep/dto/CompleteRepProfileDTO";
import { CompleteRepProfileUseCase } from "../../../application/medicalRep/use-cases/CompleteRepProfileUseCase";
import { UpdateCompanyLogoUseCase } from "../../../application/medicalRep/use-cases/UpdateCompanyLogoUseCase";
import { CreatePostUseCase } from "../../../application/productPost/use-case/CreatePostUseCase";
import { ProductPostDTO } from "../../../application/productPost/dto/ProductPostDTO";
import { EditProductPostUseCase } from "../../../application/productPost/use-case/EditProductPostUseCase";


export class MedicalRepController {
  constructor(
    private _createMedicalRepUseCase: CreateMedicalRepUseCase,
    private _getUserProfile:GetRepProfileByIdUseCase,
    private _ProfileImageUpdateUseCase:ProfileImageUpdateUseCase,
    private _completeRepProfileUseCase:CompleteRepProfileUseCase,
    private _updateCompanyLogoUseCase:UpdateCompanyLogoUseCase,
    private _createPostUseCase:CreatePostUseCase,
    private _editposUseCase:EditProductPostUseCase,
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
  completeProfile=async(req:Request,res:Response)=>{
    const {userId}=req.params;
    const data=req.body as CompleteRepProfileDTO;
    const response=await this._completeRepProfileUseCase.execute(userId,data);
    return res.json({success:true,message:response});
  }
  updateCompanyLogo=async(req:Request,res:Response)=>{
   const {userId}=req.params;
   const file=req.file ?req.file :null;
   const response=await this._updateCompanyLogoUseCase.execute(userId,file);
   return res.json({success:true,data:response});
  }
  createPost=async(req:Request,res:Response)=>{
    const {userId}=req.params;
    const dto=req.body as ProductPostDTO;
    if(req.files && Array.isArray(req.files)){
      dto.imageUrl=req.files.map((file)=>file.path);
    }else{
      dto.imageUrl=[];
    }
    const response=await this._createPostUseCase.execute(userId,dto);
    return res.json({success:true,message:response});
  }
  editPost=async(req:Request,res:Response)=>{
    const {userId}=req.params;
    const dto=req.body as ProductPostDTO;
    if(req.files && Array.isArray(req.files)){
      dto.imageUrl=req.files.map((file)=>file.path);
    }else{
      dto.imageUrl=[];
    }
    const response=await this._editposUseCase.execute(userId,dto);
    return res.json({success:true,message:response});
  }
}
