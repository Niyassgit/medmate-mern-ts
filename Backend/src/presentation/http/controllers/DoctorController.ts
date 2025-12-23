import { Request, Response } from "express";
import { ICreateDoctorUseCase } from "../../../application/doctor/interfaces/ICreateDoctorUseCase";
import { RegisterDoctorDTO } from "../../../application/doctor/dto/RegisterDoctorDTO";
import { IGetDoctorProfileByIdUseCase } from "../../../application/doctor/interfaces/IGetDoctoraProfileByIdUseCase";
import { IProfileImageUpdateUseCase } from "../../../application/doctor/interfaces/IProfileImageUpdateUseCase";
import { ICompleteProfileUseCase } from "../../../application/doctor/interfaces/ICompleteProfileUseCase";
import { CompleteDoctorProfileDTO } from "../../../application/doctor/dto/CompleteProfileDTO";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { INetworkUseCase } from "../../../application/doctor/interfaces/INetworkUseCase";
import { IDoctorConnectionRequestUseCase } from "../../../application/connection/interfaces/IDoctorConnectionRequestUseCase";
import { IDoctorAcceptConnectionRequestUseCase } from "../../../application/connection/interfaces/IDoctorAcceptConnectionRequestUseCase";
import { IDoctorAnalyticsUseCase } from "../../../application/doctor/interfaces/IDoctorAnalyticsUseCase";
import { IGetFeedUseCase } from "../../../application/doctor/interfaces/IGetFeedUseCase";
import { IPostDetailsUseCase } from "../../../application/doctor/interfaces/IPostDetailsUseCase";
import { IGetRepDetailsOnDoctorUseCase } from "../../../application/doctor/interfaces/IGetRepDetailsOnDoctorUseCase";
import { GetOptionalUserId } from "../utils/GetOptionalUserId";
import { IToggleLikeOnPostUseCase } from "../../../application/Like/interfaces/IToggleLikeOnPostUseCase";
import { IToggleInterestOnPostUseCase } from "../../../application/interest/interfaces/IToggleInterestOnPostUseCase";
import { IDoctorMutualConnectionsUseCase } from "../../../application/doctor/interfaces/IDoctorMutualConnectionsUseCase";
import { IDoctorPendingConnectionsUseCase } from "../../../application/doctor/interfaces/IDoctorPendingConnectionsUseCase";
import { IGetDoctorNotificationsUseCase } from "../../../application/notification/interfaces/IGetDoctorNotificationsUseCase";
import { IDoctorRejectConnectionUseCase } from "../../../application/connection/interfaces/IDoctorRejectConnectionUseCase";
import { IDoctorAcceptOnNotUseCase } from "../../../application/connection/interfaces/IDoctorAcceptOnNotUseCase";
import { IMakeAllAsReadNotificationUseCase } from "../../../application/notification/interfaces/IMarkAllAsReadNotificartionUseCase";
import { IMarkNotificationAsReadUseCase } from "../../../application/notification/interfaces/IMakNotificationAsReadUseCase";
import { INotificationUnreadCountUsecase } from "../../../application/notification/interfaces/INotificationUnreadCountUseCase";
import { IGetConversationsUseCase } from "../../../application/conversation/interfaces/IGetUserConversationsUseCase";
import { IGetAllMessagesUseCase } from "../../../application/conversation/interfaces/IGetAllMessagesUseCase";
import { CreateMessageDTO } from "../../../application/conversation/dto/CreateMessageDTO";
import { ICreateDoctorMessageUseCase } from "../../../application/conversation/interfaces/ICreateDoctorMessageUseCase";
import { IDoctorMessageMarkAsReadUseCase } from "../../../application/conversation/interfaces/IDoctorMessageMarkAsReadUseCase";
import { IGetRepsListForPracticeUseCase } from "../../../application/doctor/interfaces/IGetRepsListForPracticeUseCase";
import { IGetRepProductsForDoctorUseCase } from "../../../application/doctor/interfaces/IGetRepProductsForDoctorUseCase";
import { PrescriptionDTO } from "../../../application/prescription/dto/PrescriptionDTO";
import { ICreatePrescriptionUseCase } from "../../../application/prescription/interfaces/ICreatePrescriptionUseCase";
import { IGetGuestsByDoctorUseCase } from "../../../application/doctor/interfaces/IGetGuestsByDoctorUseCase";
import { ICreateGuestByDoctorUseCase } from "../../../application/doctor/interfaces/ICreateGuestByDoctorUseCase";
import { CreateGuestByDoctorDTO } from "../../../application/doctor/dto/CreateGuestByDoctorDTO";
import { IGetAllPrescriptionsMadeUseCase } from "../../../application/doctor/interfaces/IGetAllPrescriptionsMadeUseCase";
import { IChangePasswordUseCase } from "../../../application/common/interfaces/IChangePasswordUseCase";
import { Role } from "../../../shared/Enums";
import { IVerifyOldPasswordUseCase } from "../../../application/common/interfaces/IverifyOldPasswordUsesCase";
import { IMakeVideoCallWithRepUseCase } from "../../../application/doctor/interfaces/IMakeVideoCallWithrepUseCase";

export class DoctorController {
  constructor(
    private _createDoctorUseCase: ICreateDoctorUseCase,
    private _getDoctorProfileByIdUseCase: IGetDoctorProfileByIdUseCase,
    private _profileImageUpdateUseCase: IProfileImageUpdateUseCase,
    private _compeletProfileUseCase: ICompleteProfileUseCase,
    private _networkUseCase: INetworkUseCase,
    private _connectionRequestUseCase: IDoctorConnectionRequestUseCase,
    private _acceptConnectionRequestUseCase: IDoctorAcceptConnectionRequestUseCase,
    private _analyticsUseCase: IDoctorAnalyticsUseCase,
    private _getFeedUseCase: IGetFeedUseCase,
    private _postDetailsUseCase: IPostDetailsUseCase,
    private _getRepDetailsOnDoctorUseCase: IGetRepDetailsOnDoctorUseCase,
    private _toggleLikeOnPostUseCase: IToggleLikeOnPostUseCase,
    private _toggleInterestOnPostUseCase: IToggleInterestOnPostUseCase,
    private _mutualConnectionListUseCase: IDoctorMutualConnectionsUseCase,
    private _pendingConnectionListUseCase: IDoctorPendingConnectionsUseCase,
    private _getDoctorNotificationsUseCase: IGetDoctorNotificationsUseCase,
    private _rejectConnectionRequestUseCase: IDoctorRejectConnectionUseCase,
    private _acceptConnectionOnNotificationPage: IDoctorAcceptOnNotUseCase,
    private _notificationsMarkAsRead: IMakeAllAsReadNotificationUseCase,
    private _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
    private _getUnreadNotificationCountUseCase: INotificationUnreadCountUsecase,
    private _getUserConversationsUseCase: IGetConversationsUseCase,
    private _getAllMessagesUseCase: IGetAllMessagesUseCase,
    private _createMessageUseCase: ICreateDoctorMessageUseCase,
    private _DoctorMessageMarkAsRead: IDoctorMessageMarkAsReadUseCase,
    private _getRepsListForPracticeUseCase: IGetRepsListForPracticeUseCase,
    private _getRepProductsForDoctorUseCase: IGetRepProductsForDoctorUseCase,
    private _createPrescriptionUseCase: ICreatePrescriptionUseCase,
    private _getGuestsByDoctorUseCase: IGetGuestsByDoctorUseCase,
    private _createGuestByDoctorUseCase: ICreateGuestByDoctorUseCase,
    private _getAllPrescriptionsMadeUseCase: IGetAllPrescriptionsMadeUseCase,
    private _changePasswordUseCase: IChangePasswordUseCase,
    private _verifyOldPasswordUseCase: IVerifyOldPasswordUseCase,
    private _makeVideoCallWithRepUseCase: IMakeVideoCallWithRepUseCase,
  ) { }

  createDoctor = async (req: Request, res: Response) => {
    const licenseImageUrl = req.file
      ? `/uploads/licenses/${req.file.filename}`
      : null;

    const data: RegisterDoctorDTO = {
      ...(req.body as RegisterDoctorDTO),
      licenseImageUrl,
    };
    const response = await this._createDoctorUseCase.execute(data);
    res.status(HttpStatusCode.CREATED).json({ success: true, ...response });
  };

  getDoctorprofileById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._getDoctorProfileByIdUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  updateProfileImage = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const fileKey = req.file ? req.file.key : null;
    const response = await this._profileImageUpdateUseCase.execute(
      userId,
      fileKey
    );
    res.status(HttpStatusCode.OK).json({ success: true, data: response });
  };

  completeProfile = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const data = req.body as CompleteDoctorProfileDTO;
    const response = await this._compeletProfileUseCase.execute(userId, data);

    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };

  networks = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { search, company, territories } = req.query;

    const filters = {
      company: company ? String(company) : undefined,
      territories: territories ? String(territories).split(",") : undefined,
    };

    const response = await this._networkUseCase.execute(
      userId,
      search as string,
      filters
    );
    res.status(HttpStatusCode.OK).json({ success: true, data: response });
  };

  connectionRequest = async (req: Request, res: Response) => {
    const { repId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._connectionRequestUseCase.execute(
      repId,
      userId
    );
    res.status(HttpStatusCode.OK).json({ success: true, message: response });
  };

  acceptConnection = async (req: Request, res: Response) => {
    const { repId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._acceptConnectionRequestUseCase.execute(
      repId,
      userId
    );
    res.status(HttpStatusCode.OK).json({ success: true, message: response });
  };

  analytics = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._analyticsUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  getFeed = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._getFeedUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  postDetails = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._postDetailsUseCase.execute(postId, userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  RepDetails = async (req: Request, res: Response) => {
    const { repId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._getRepDetailsOnDoctorUseCase.execute(
      repId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  toggleLike = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._toggleLikeOnPostUseCase.execute(
      postId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  toggleInterest = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._toggleInterestOnPostUseCase.exectue(
      postId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  mutualConnections = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._mutualConnectionListUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  pendingConnections = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._pendingConnectionListUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  notifications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const cursor = req.query.cursor as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const response = await this._getDoctorNotificationsUseCase.execute(
      userId,
      cursor,
      limit
    );

    return res.json({ success: true, data: response });
  };

  rejectConnection = async (req: Request, res: Response) => {
    const { repId, notificationId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._rejectConnectionRequestUseCase.execute(
      repId,
      notificationId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };

  acceptConnectionOnNot = async (req: Request, res: Response) => {
    const { repId, notificationId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._acceptConnectionOnNotificationPage.execute(
      repId,
      notificationId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };

  markAllAsReadNotification = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._notificationsMarkAsRead.execute(userId);
    return res
      .status(HttpStatusCode.NO_CONTENT)
      .json({ success: true, message: response });
  };

  markAsReadNotification = async (req: Request, res: Response) => {
    const { notificationId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._markNotificationAsReadUseCase.execute(
      notificationId,
      userId
    );
    return res
      .status(HttpStatusCode.NO_CONTENT)
      .json({ success: true, message: response });
  };

  notificationUnreadCount = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._getUnreadNotificationCountUseCase.execute(
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  getConversations = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const response = await this._getUserConversationsUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  getMessages = async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { cursor } = req.query;
    const response = await this._getAllMessagesUseCase.execute(
      conversationId,
      cursor as string | undefined
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  createMessage = async (req: Request, res: Response) => {
    const data = req.body as CreateMessageDTO;
    const userId = GetOptionalUserId(req.user);
    const response = await this._createMessageUseCase.execute(data, userId);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, data: response });
  };

  markMessageAsRead = async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const userId = GetOptionalUserId(req.user);
    await this._DoctorMessageMarkAsRead.execute(conversationId, userId);
    return res.sendStatus(HttpStatusCode.NO_CONTENT);
  };

  repsList = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const response = await this._getRepsListForPracticeUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  repProducts = async (req: Request, res: Response) => {
    const { repId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._getRepProductsForDoctorUseCase.execute(
      repId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  createPrescription = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { guestId } = req.params;
    const dto = req.body as PrescriptionDTO;
    const response = await this._createPrescriptionUseCase.execute(
      guestId,
      dto,
      userId
    );
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, data: response });
  };

  getGuests = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { search } = req.query;
    const response = await this._getGuestsByDoctorUseCase.execute(
      userId,
      search as string | undefined
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  createGuest = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const dto = req.body as CreateGuestByDoctorDTO;
    const response = await this._createGuestByDoctorUseCase.execute(
      dto,
      userId
    );
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, data: response });
  };

  getAllPrescriptions = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const response = await this._getAllPrescriptionsMadeUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  verifyPassword = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { password } = req.query;
    const response = await this._verifyOldPasswordUseCase.execute(
      password as string,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  changePassword = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { role, newPassword } = req.query;
    const response = await this._changePasswordUseCase.execute(
      role as Role,
      newPassword as string,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };

  makeCall = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { repId } = req.params;
    await this._makeVideoCallWithRepUseCase.execute(repId, userId);
    return res.sendStatus(HttpStatusCode.OK);
  };

}
