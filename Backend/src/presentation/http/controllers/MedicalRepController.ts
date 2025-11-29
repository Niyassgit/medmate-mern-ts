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
import { IRepMakeConnectionRequestUseCase } from "../../../application/connection/interfaces/IMakeConnectionRequestUseCase";
import { IRepAcceptConnectionRequestUseCase } from "../../../application/connection/interfaces/IRepAcceptConnectionRequestUseCase";
import { IGetRepAnalyticsUseCase } from "../../../application/medicalRep/interfaces/IGetRepAnalyticsUseCase";
import { IArchivePostUseCase } from "../../../application/productPost/interfaces/IArchivePostUseCase";
import { IDeletePostUseCase } from "../../../application/productPost/interfaces/IDeletePostUseCase";
import { IGetDoctorDetailsOnRepSideUseCase } from "../../../application/medicalRep/interfaces/IGetDoctorDetailsOnRepSideUseCase";
import { GetOptionalUserId } from "../utils/GetOptionalUserId";
import { IRepMutualConnectionsUseCase } from "../../../application/medicalRep/interfaces/IRepMutualConnectionsUseCase";
import { IRepPendingConnectionsUseCase } from "../../../application/medicalRep/interfaces/IRepPendingConnectionsUseCase";
import { IGetRepNotificationsUseCase } from "../../../application/notification/interfaces/IGetRepNotificationsUseCase";
import { IRepRejectConnectionUseCase } from "../../../application/connection/interfaces/IRepRejectConnnectionUseCase";
import { IRepAcceptConnOnNotUseCase } from "../../../application/connection/interfaces/IRepAcceptConnOnNotUseCase";
import { IMakeAllAsReadNotificationUseCase } from "../../../application/notification/interfaces/IMarkAllAsReadNotificartionUseCase";
import { IMarkNotificationAsReadUseCase } from "../../../application/notification/interfaces/IMakNotificationAsReadUseCase";
import { INotificationUnreadCountUsecase } from "../../../application/notification/interfaces/INotificationUnreadCountUseCase";
import { IGetConversationsUseCase } from "../../../application/conversation/interfaces/IGetUserConversationsUseCase";
import { IGetAllMessagesUseCase } from "../../../application/conversation/interfaces/IGetAllMessagesUseCase";
import { CreateMessageDTO } from "../../../application/conversation/dto/CreateMessageDTO";
import { ICreateRepMessageUseCase } from "../../../application/conversation/interfaces/ICreateRepMessage";
import { IRepMessageMarkAsReadUseCase } from "../../../application/conversation/interfaces/IRepMessageMarkAsReadUseCase";

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
    private _makeConnectionRequestUsecase: IRepMakeConnectionRequestUseCase,
    private _acceptConnectionRequestUseCase: IRepAcceptConnectionRequestUseCase,
    private _getRepAnalticsUseCase: IGetRepAnalyticsUseCase,
    private _archivePostUseCase: IArchivePostUseCase,
    private _deletePostUseCase: IDeletePostUseCase,
    private _getDoctorDetailsOnRepSideUseCase: IGetDoctorDetailsOnRepSideUseCase,
    private _mutualConnectionsUseCase: IRepMutualConnectionsUseCase,
    private _pendingConnectionsUseCase: IRepPendingConnectionsUseCase,
    private _getAllNotificationsUseCase: IGetRepNotificationsUseCase,
    private _rejectConnectionUseCase: IRepRejectConnectionUseCase,
    private _acceptRequestOnNotificationPage: IRepAcceptConnOnNotUseCase,
    private _markAllNotificationsAsRead: IMakeAllAsReadNotificationUseCase,
    private _markAsReadNotificationUseCase: IMarkNotificationAsReadUseCase,
    private _countOfUnreadNotificationUseCase: INotificationUnreadCountUsecase,
    private _repConversationsOnChatUseCase: IGetConversationsUseCase,
    private _getAllMessagesUseCase: IGetAllMessagesUseCase,
    private _createMessageuseCase: ICreateRepMessageUseCase,
    private _repMessageMarkAsReadUseCase: IRepMessageMarkAsReadUseCase
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
    const { search, opTime, minAge, maxAge } = req.query;
    const filters = {
      opTime: opTime ? String(opTime) : undefined,
      minAge: minAge ? Number(minAge) : undefined,
      maxAge: maxAge ? Number(maxAge) : undefined,
    };
    const resposne = await this._getNetworksUseCase.execute(
      userId,
      search as string,
      filters
    );
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
    const userId = GetOptionalUserId(req.user);
    if (!userId) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized" });
    }
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
    const userId = GetOptionalUserId(req.user);
    const response = await this._getDoctorDetailsOnRepSideUseCase.execute(
      doctorId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  mutualConnections = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._mutualConnectionsUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  pendingConnections = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._pendingConnectionsUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  notifications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const cursor = req.query.cursor as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const response = await this._getAllNotificationsUseCase.execute(
      userId,
      cursor,
      limit
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  rejectConnection = async (req: Request, res: Response) => {
    const { doctorId, notificationId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._rejectConnectionUseCase.execute(
      doctorId,
      notificationId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };

  requestAccept = async (req: Request, res: Response) => {
    const { doctorId, notificationId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._acceptRequestOnNotificationPage.execute(
      doctorId,
      notificationId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };

  markAllAsReadNotifications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._markAllNotificationsAsRead.execute(userId);
    return res
      .status(HttpStatusCode.NO_CONTENT)
      .json({ success: true, message: response });
  };

  markAsReadNotification = async (req: Request, res: Response) => {
    const { notificationId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._markAsReadNotificationUseCase.execute(
      notificationId,
      userId
    );
    return res
      .status(HttpStatusCode.NO_CONTENT)
      .json({ success: true, message: response });
  };

  notificaitonUnreadCount = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._countOfUnreadNotificationUseCase.execute(
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  conversations = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const response = await this._repConversationsOnChatUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  getAllMessages = async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { cursor } = req.query;
    const response = await this._getAllMessagesUseCase.execute(
      conversationId,
      cursor as string | undefined
    );
    return res.status(HttpStatusCode.OK).json({ succes: true, data: response });
  };

  createMessage = async (req: Request, res: Response) => {
    const data = req.body as CreateMessageDTO;
    const userId = GetOptionalUserId(req.user);
    const response = await this._createMessageuseCase.execute(data, userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  markMessageAsRead = async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const userId = GetOptionalUserId(req.user);
    await this._repMessageMarkAsReadUseCase.execute(conversationId, userId);
    return res.sendStatus(HttpStatusCode.NO_CONTENT);
  };
}
