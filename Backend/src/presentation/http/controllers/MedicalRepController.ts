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
import { IGetNetworksUseCase } from "../../../application/medicalRep/interfaces/IGetNetWorksUseCase";
import { IMakeConnectionRequestUseCase } from "../../../application/medicalRep/interfaces/IMakeConnectionRequestUseCase";
import { IAcceptConnectionRequestUseCase } from "../../../application/medicalRep/interfaces/IAcceptConnectionRequestUseCase";
import { IGetRepAnalyticsUseCase } from "../../../application/medicalRep/interfaces/IGetRepAnalyticsUseCase";
import { IArchivePostUseCase } from "../../../application/productPost/interfaces/IArchivePostUseCase";
import { IDeletePostUseCase } from "../../../application/productPost/interfaces/IDeletePostUseCase";
import { IGetDoctorDetailsOnRepSideUseCase } from "../../../application/medicalRep/interfaces/IGetDoctorDetailsOnRepSideUseCase";
import { GetOptionalUserId } from "../utils/GetOptionalUserId";

export class MedicalRepController {
  constructor(
    private _createMedicalRepUseCase: ICreateMedicalRepUseCase,
    private _getUserProfile: IGetRepProfileByIdUseCase,
    private _ProfileImageUpdateUseCase: IProfileImageUpdateUseCase,
    private _completeRepProfileUseCase: ICompleteRepProfileUseCase,
    private _createPostUseCase: ICreatePostUseCase,
    private _editposUseCase: IEditProductPostUseCase,
    private _getProductsListUseCase: IGetProductPostListUseCase,
    private _getPostDetailsUseCase: IGetProductPostDetailsUseCase,
    private _getNetworksUseCase: IGetNetworksUseCase,
    private _makeConnectionRequestUsecase: IMakeConnectionRequestUseCase,
    private _acceptConnectionRequestUseCase: IAcceptConnectionRequestUseCase,
    private _getRepAnalticsUseCase: IGetRepAnalyticsUseCase,
    private _archivePostUseCase: IArchivePostUseCase,
    private _deletePostUseCase: IDeletePostUseCase,
    private _getDoctorDetailsOnRepSideUseCase: IGetDoctorDetailsOnRepSideUseCase
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
    const file = req.file || null;
    const dto = req.body as CompleteRepProfileDTO;
    const response = await this._completeRepProfileUseCase.execute(
      userId,
      dto,
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
      dto.imageUrl = req.files
        .map((file) => file.key)
        .filter((key): key is string => !!key);
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
  archivePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._archivePostUseCase.execute(postId, userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };
  deletePost = async (req: Request, res: Response) => {
    const { postId } = req.params;  
    const userId = GetOptionalUserId(req.user);
    const response = await this._deletePostUseCase.execute(postId, userId);
    return res
      .status(HttpStatusCode.NO_CONTENT)
      .json({ success: true, message: response });
  };
  networks = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const resposne = await this._getNetworksUseCase.execute(userId);
    res.status(HttpStatusCode.OK).json({ success: true, data: resposne });
  };
  connectionRequest = async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._makeConnectionRequestUsecase.execute(
      doctorId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };
  acceptingConnectionRequest = async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const userId = req.user?.userId as string;
    const response = await this._acceptConnectionRequestUseCase.execute(
      doctorId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };
  analytics = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._getRepAnalticsUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };
  doctorDetails = async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const userId =GetOptionalUserId(req.user);
    const response = await this._getDoctorDetailsOnRepSideUseCase.execute(
      doctorId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };
}
 