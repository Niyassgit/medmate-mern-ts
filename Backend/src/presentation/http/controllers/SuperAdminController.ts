import { Request, Response } from "express";
import { CreateSuperAdminUseCase } from "../../../application/superAdmin/auth/CreateSuperAdminUseCase";
import { GetSuperAdminByEmailIdUseCase } from "../../../application/superAdmin/auth/GetSuperAdminByEmailIdUseCase";
import { RegisterSuperAdminDTO } from "../../../application/superAdmin/dto/RegisterSuperAdminDTO";
import { GetAllDoctorsUseCase } from "../../../application/superAdmin/useCases/GetAllDoctorsUseCase";
import { GetAllRepsUseCase } from "../../../application/superAdmin/useCases/GetAllRepsUseCase";
import { BlockUserUseCase } from "../../../application/superAdmin/useCases/BlockUserUseCase";
import { UnBlockUserUseCase } from "../../../application/superAdmin/useCases/UnblockUserUseCase";
import { GetDoctorDetailsUseCase } from "../../../application/superAdmin/useCases/GetDoctorDetailsUseCase";
import { GetMedicalRepDetailsUseCase } from "../../../application/superAdmin/useCases/GetMedicalRepDetails";

export class SuperAdminController {
  constructor(
    private _createSuperAdminUseCase: CreateSuperAdminUseCase,
    private _getSuperAdminByEmailIdUseCase: GetSuperAdminByEmailIdUseCase,
    private _getAllDoctorsUseCase: GetAllDoctorsUseCase,
    private _getAllRepsUseCase: GetAllRepsUseCase,
    private _blockUserUseCase: BlockUserUseCase,
    private _unblockUserUseCase: UnBlockUserUseCase,
    private _getDoctorDetails:GetDoctorDetailsUseCase,
    private _getMedicalRepDetails:GetMedicalRepDetailsUseCase
  ) {}

  createSuperAdmin = async (req: Request, res: Response) => {
    const SuperAdmin = await this._createSuperAdminUseCase.execute(
      req.body as RegisterSuperAdminDTO
    );
    res.status(201).json({ success: true, data: SuperAdmin });
  };

  getSuperAdminByEmail = async (req: Request, res: Response) => {
    const dto = req.body as RegisterSuperAdminDTO;
    const superAdmin = await this._getSuperAdminByEmailIdUseCase.execute(
      dto.email
    );
    res.status(200).json({ success: true, data: superAdmin });
  };

  getAllDoctors = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || "";
    const doctors = await this._getAllDoctorsUseCase.execute(page, limit,search);
    res.json({ success: true, data: doctors, page, limit });
  };

  getAllReps = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const search= req.query.search as string || "";
    const reps = await this._getAllRepsUseCase.execute(page, limit,search);
    res.json({ success: true, data: reps, page, limit });
  };
  blockUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updatedUser = await this._blockUserUseCase.execute(userId);

    return res.json({
      success: true,
      message: "User blocked successfully",
      updatedUser,
    });
  };
  unBlockUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updatedUser = await this._unblockUserUseCase.execute(userId);

    return res.json({
      success: true,
      message: "User unblocked successfully",
      updatedUser,
    });
  };
  doctorDetails=async (req:Request,res:Response)=>{
    const {userId}=req.params;
    console.log("doctor id for admin page :",userId);
    const user=await this._getDoctorDetails.execute(userId);
    return res.json({success:true,data:user})
  }
  repDetails=async (req:Request,res:Response)=>{
    const {userId}=req.params;
    const user=await this._getMedicalRepDetails.execute(userId);
    return res.json({success:true,data:user})
  }
}
