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
    private _acceptConnectionOnNotificationPage: IDoctorAcceptOnNotUseCase
  ) {}

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
    const { search } = req.query;
    const response = await this._networkUseCase.execute(
      userId,
      search as string
    );
    res.status(HttpStatusCode.OK).json({ success: true, data: response });
  };

  connectionRequest = async (req: Request, res: Response) => {
    const { repId } = req.params;
    const userId = GetOptionalUserId(req.user);
    if (!userId) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized" });
    }
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
    console.log("userId:", userId);
    const response = await this._pendingConnectionListUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  notifications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._getDoctorNotificationsUseCase.execute(userId);
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
}
