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
import { processImages } from "../utils/ImageHandler";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";

export class MedicalRepController {
  constructor(
    private _createMedicalRepUseCase: ICreateMedicalRepUseCase,
    private _getUserProfile: IGetRepProfileByIdUseCase,
    private _ProfileImageUpdateUseCase: IProfileImageUpdateUseCase,
    private _completeRepProfileUseCase: ICompleteRepProfileUseCase,
    private _createPostUseCase: ICreatePostUseCase,
    private _editposUseCase: IEditProductPostUseCase,
    private _getProductsListUseCase: IGetProductPostListUseCase,
    private _getPostDetailsUseCase: IGetProductPostDetailsUseCase
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
    res.status(HttpStatusCode.OK).json({ success: true, ...response });
  };
  getRepProfileById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._getUserProfile.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };
  updateProfileImage = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const fileKey = req.file ? req.file.key : null;
    const response = await this._ProfileImageUpdateUseCase.execute(
      userId,
      fileKey
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
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
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };
  createPost = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const dto = req.body as ProductPostDTO;
    if (req.files && Array.isArray(req.files)) {
      dto.imageUrl = req.files.map((file) => file.key).filter((key):key is string=>!!key);
    } else {
      dto.imageUrl = [];
    }
    const response = await this._createPostUseCase.execute(userId, dto);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, message: response });
  };
  posts = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._getProductsListUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };
  postDetails = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const response = await this._getPostDetailsUseCase.execute(postId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  editPost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const dto = req.body as Partial<ProductPostDTO>;
    dto.imageUrl = processImages(req.body.existingImages, req.files);
    const response = await this._editposUseCase.execute(
      postId,
      dto as ProductPostDTO
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };
}
