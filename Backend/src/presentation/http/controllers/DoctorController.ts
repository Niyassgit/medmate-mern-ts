import { Request, Response } from "express";
import { CreateDoctorUseCase } from "../../../application/doctor/auth/CreateDoctorUseCase";
import { GetDoctorProfileByIdUseCase } from "../../../application/doctor/auth/GetDoctorProfileByIdUseCase";
import { GetDoctorProfileByEmailUseCase } from "../../../application/doctor/auth/GetDoctorProfileByEmailUseCase";
import { RegisterDoctorDTO } from "../../../application/doctor/dto/RegisterDoctorDTO";

export class DoctorController {
  constructor(
    private _createDoctorUseCase: CreateDoctorUseCase,
    private _getDoctorProfileByIdUseCase: GetDoctorProfileByIdUseCase,
    private _getDoctorProfileByEmailUseCase: GetDoctorProfileByEmailUseCase
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
  getDoctorProfileById = async (req: Request, res: Response) => {
    const doctor = await this._getDoctorProfileByIdUseCase.execute(
      req.params.id
    );
    res.status(200).json({ success: true, data: doctor });
  };
  getDoctorProfileByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    const doctor = await this._getDoctorProfileByEmailUseCase.execute(email);
    res.status(200).json({ success: true, data: doctor });
  };
}
