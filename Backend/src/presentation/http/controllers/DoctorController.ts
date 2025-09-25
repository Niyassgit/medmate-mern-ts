import { Request, Response } from "express";
import { CreateDoctorUseCase } from "../../../application/doctor/auth/CreateDoctorUseCase";
import { RegisterDoctorDTO } from "../../../application/doctor/dto/RegisterDoctorDTO";
import { GetDoctorProfileByIdUseCase } from "../../../application/doctor/use-cases/GetDoctorProfleByIdUseCase";

export class DoctorController {
  constructor(
    private _createDoctorUseCase: CreateDoctorUseCase,
    private _getDoctorProfileByIdUseCase:GetDoctorProfileByIdUseCase
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
  getDoctorprofileById=async(req:Request,res:Response)=>{
    const {userId}=req.params;
    const response=await this._getDoctorProfileByIdUseCase.execute(userId);
    return res.json({success:true,data:response});
  }

}
