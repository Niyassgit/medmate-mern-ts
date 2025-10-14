import { Request, Response } from "express";
import { ICreateDoctorUseCase } from "../../../application/doctor/interfaces/ICreateDoctorUseCase";
import { RegisterDoctorDTO } from "../../../application/doctor/dto/RegisterDoctorDTO";
import { IGetDoctorProfileByIdUseCase } from "../../../application/doctor/interfaces/IGetDoctoraProfileByIdUseCase";
import { IProfileImageUpdateUseCase } from "../../../application/doctor/interfaces/IProfileImageUpdateUseCase"; 
import { ICompleteProfileUseCase } from "../../../application/doctor/interfaces/ICompleteProfileUseCase";
import { CompleteDoctorProfileDTO } from "../../../application/doctor/dto/CompleteProfileDTO";


export class DoctorController {
  constructor(
    private _createDoctorUseCase: ICreateDoctorUseCase,
    private _getDoctorProfileByIdUseCase: IGetDoctorProfileByIdUseCase,
    private _profileImageUpdateUseCase: IProfileImageUpdateUseCase,
    private _compeletProfileUseCase: ICompleteProfileUseCase
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
    res.status(201).json({ success: true, ...response });
  };
  getDoctorprofileById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await this._getDoctorProfileByIdUseCase.execute(userId);
    return res.json({ success: true, data: response });
  };
  updateProfileImage = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const fileUrl = req.file ? req.file.key : null;
    const response = await this._profileImageUpdateUseCase.execute(
      userId,
      fileUrl
    );
    res.json({ success: true, message: response });
  };
  completeProfile = async (req: Request, res: Response) => {
    const { userId} = req.params;
    const data = req.body as CompleteDoctorProfileDTO;
    const response = await this._compeletProfileUseCase.execute(userId, data);
    return res.json({ success: true, message: response });
  };
}
