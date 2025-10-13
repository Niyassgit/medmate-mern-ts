import { Request, Response } from "express";
import { ICreateMedicalRepUseCase } from "../../../application/medicalRep/interfaces/ICreateMedicalRepUseCase";
import { RegisterMedicalRepDTO } from "../../../application/medicalRep/dto/RegisterMedicalRepDTO";
import { IGetRepProfileByIdUseCase } from "../../../application/medicalRep/interfaces/IGetRepProfileByIdUseCase";
import { IProfileImageUpdateUseCase } from "../../../application/medicalRep/interfaces/IProfileImageUpdateUseCase";
import { CompleteRepProfileDTO } from "../../../application/medicalRep/dto/CompleteRepProfileDTO";
import { ICompleteRepProfileUseCase } from "../../../application/medicalRep/interfaces/ICompleteRepProfileUseCase";
import { ICreatePostUseCase } from "../../../application/productPost/interfaces/ICreatePostUseCase";
import { ProductPostDTO } from "../../../application/productPost/dto/ProductPostDTO";
import { IEditProductPostUseCase } from "../../../application/productPost/interfaces/IEditProductPostUseCase"; 
import { IGetProductPostListUseCase } from "../../../application/productPost/interfaces/IGetProductPostListUseCase"; 
import { IGetProductPostDetailsUseCase } from "../../../application/productPost/interfaces/IPostDetailsUseCase";

export class MedicalRepController {
  constructor(
    private _createMedicalRepUseCase: ICreateMedicalRepUseCase,
    private _getUserProfile: IGetRepProfileByIdUseCase,
    private _ProfileImageUpdateUseCase: IProfileImageUpdateUseCase,
    private _completeRepProfileUseCase: ICompleteRepProfileUseCase,
    private _createPostUseCase: ICreatePostUseCase,
    private _editposUseCase: IEditProductPostUseCase,
    private _getProductsListUseCase:IGetProductPostListUseCase,
    private _getPostDetailsUseCase:IGetProductPostDetailsUseCase
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
  getRepProfileById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._getUserProfile.execute(userId);
    return res.json({ success: true, data: response });
  };
  updateProfileImage = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const file = req.file ? req.file : null;
    const response = await this._ProfileImageUpdateUseCase.execute(
      userId,
      file
    );
    return res.json({ success: true, message: response });
  };
  completeProfile = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const data = req.body as CompleteRepProfileDTO;
    const file = req.file || null;
    const response = await this._completeRepProfileUseCase.execute(
      userId,
      data,
      file
    );
    return res.json({ success: true, message: response });
  };
  createPost = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const dto = req.body as ProductPostDTO;
    if (req.files && Array.isArray(req.files)) {
      dto.imageUrl = req.files.map((file) => file.path);
    } else {
      dto.imageUrl = [];
    }
    const response = await this._createPostUseCase.execute(userId, dto);
    return res.json({ success: true, message: response });
  };
  posts=async(req:Request,res:Response)=>{
    const {userId}=req.params;
    const response=await this._getProductsListUseCase.execute(userId);
    return res.json({success:true,data:response});
  }
  postDetails=async(req:Request,res:Response)=>{
    const {postId}=req.params;
    const response=await this._getPostDetailsUseCase.execute(postId);
    return res.json({success:true,data:response});
  }

   editPost = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const dto = req.body as ProductPostDTO;
    if (req.files && Array.isArray(req.files)) {
      dto.imageUrl = req.files.map((file) => file.path);
    } else {
      dto.imageUrl = [];
    }
    const response = await this._editposUseCase.execute(userId, dto);
    return res.json({ success: true, message: response });
  };

}
