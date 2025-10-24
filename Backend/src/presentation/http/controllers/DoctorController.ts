import { Request, Response } from "express";
import { ICreateDoctorUseCase } from "../../../application/doctor/interfaces/ICreateDoctorUseCase";
import { RegisterDoctorDTO } from "../../../application/doctor/dto/RegisterDoctorDTO";
import { IGetDoctorProfileByIdUseCase } from "../../../application/doctor/interfaces/IGetDoctoraProfileByIdUseCase";
import { IProfileImageUpdateUseCase } from "../../../application/doctor/interfaces/IProfileImageUpdateUseCase";
import { ICompleteProfileUseCase } from "../../../application/doctor/interfaces/ICompleteProfileUseCase";
import { CompleteDoctorProfileDTO } from "../../../application/doctor/dto/CompleteProfileDTO";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { INetworkUseCase } from "../../../application/doctor/interfaces/INetworkUseCase";
import { IConnectionRequestUseCase } from "../../../application/doctor/interfaces/IConnectionRequestUseCase";
import { IAcceptConnectionRequestUseCase } from "../../../application/medicalRep/interfaces/IAcceptConnectionRequestUseCase";

export class DoctorController {
  constructor(
    private _createDoctorUseCase: ICreateDoctorUseCase,
    private _getDoctorProfileByIdUseCase: IGetDoctorProfileByIdUseCase,
    private _profileImageUpdateUseCase: IProfileImageUpdateUseCase,
    private _compeletProfileUseCase: ICompleteProfileUseCase,
    private _networkUseCase: INetworkUseCase,
    private _connectionRequestUseCase: IConnectionRequestUseCase,
    private _acceptConnectionRequestUseCase: IAcceptConnectionRequestUseCase
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
    res.status(HttpStatusCode.OK).json({ success: true, message: response });
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
    const response = await this._networkUseCase.execute(userId);
    res.status(HttpStatusCode.OK).json({ success: true, data: response });
  };
  connectionRequest = async (req: Request, res: Response) => {
    const { repId } = req.params;
    const userId = req.user?.userId;
    const response = await this._connectionRequestUseCase.execute(
      repId,
      userId
    );
    res.status(HttpStatusCode.OK).json({ success: true, message: response });
  };
  acceptConnection = async (req: Request, res: Response) => {
    const { repId } = req.params;
    const userId = req.user?.userId;
    const response = await this._acceptConnectionRequestUseCase.execute(
      repId,
      userId
    );
    res.status(HttpStatusCode.OK).json({ success: true, message: response });
  };
}
