import { Request, response, Response } from "express";
import { ICreateSuperAdminUseCase } from "../../../application/superAdmin/interfaces/ICreateSuperAdminUseCase";
import { IGetSuperAdminByEmailUseCase } from "../../../application/superAdmin/interfaces/IGetSuperAdminByEmailUseCase";
import { RegisterSuperAdminDTO } from "../../../application/superAdmin/dto/RegisterSuperAdminDTO";
import { IGetAllDoctorsUseCase } from "../../../application/superAdmin/interfaces/IGetAllDoctorsUseCase";
import { IGetAllRepsUseCase } from "../../../application/superAdmin/interfaces/IGetAllRespsUseCase";
import { IBlockUserUseCase } from "../../../application/superAdmin/interfaces/IBlockUserUseCase";
import { IUnblockUserUseCase } from "../../../application/superAdmin/interfaces/IUnblockUserUseCase";
import { IGetDoctorDetailsUseCase } from "../../../application/superAdmin/interfaces/IGetDoctorDetailsUseCase";
import { IGetMedicalRepDetailsUseCase } from "../../../application/superAdmin/interfaces/IGetMedicalRepDetailsUseCase";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { SuccessMessages } from "../../../shared/Messages";
import { IGetTerritoriesUseCase } from "../../../application/superAdmin/interfaces/IGetTerritoriesUseCase";
import { ICreateTerritoryUseCase } from "../../../application/superAdmin/interfaces/ICreateTerritoryUseCase";
import { TerritorySchemaDTO } from "../validators/TerritoryValidateSchema";
import { IEditTerritoryUseCase } from "../../../application/superAdmin/interfaces/IEditTerritoryUseCase";
import { DepartmentSchemaDTO } from "../validators/DepartmentShema";
import { ICreateDepartmentUseCase } from "../../../application/superAdmin/interfaces/ICreateDepartmentUseCase";
import { IGetAllDepartmentsUseCase } from "../../../application/superAdmin/interfaces/IGetAllDepartmentsUseCase";
import { IEditDepartmentUseCase } from "../../../application/superAdmin/interfaces/IEditDepartmentUseCase";

export class SuperAdminController {
  constructor(
    private _createSuperAdminUseCase: ICreateSuperAdminUseCase,
    private _getSuperAdminByEmailUseCase: IGetSuperAdminByEmailUseCase,
    private _getAllDoctorsUseCase: IGetAllDoctorsUseCase,
    private _getAllRepsUseCase: IGetAllRepsUseCase,
    private _blockUserUseCase: IBlockUserUseCase,
    private _unblockUserUseCase: IUnblockUserUseCase,
    private _getDoctorDetails: IGetDoctorDetailsUseCase,
    private _getMedicalRepDetails: IGetMedicalRepDetailsUseCase,
    private _getTerritoriesUseCase: IGetTerritoriesUseCase,
    private _createTerritoryUseCase: ICreateTerritoryUseCase,
    private _edtiTerritoryUseCase: IEditTerritoryUseCase,
    private _createDepartmentUseCase: ICreateDepartmentUseCase,
    private _getAllDepartmentsUseCase: IGetAllDepartmentsUseCase,
    private _editDepartmentUseCase: IEditDepartmentUseCase
  ) {}

  createSuperAdmin = async (req: Request, res: Response) => {
    const SuperAdmin = await this._createSuperAdminUseCase.execute(
      req.body as RegisterSuperAdminDTO
    );
    res.status(HttpStatusCode.OK).json({ success: true, data: SuperAdmin });
  };

  getSuperAdminByEmail = async (req: Request, res: Response) => {
    const dto = req.body as RegisterSuperAdminDTO;
    const superAdmin = await this._getSuperAdminByEmailUseCase.execute(
      dto.email
    );
    res.status(HttpStatusCode.OK).json({ success: true, data: superAdmin });
  };

  getAllDoctors = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const doctors = await this._getAllDoctorsUseCase.execute(
      page,
      limit,
      search
    );
    res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: doctors, page, limit });
  };

  getAllReps = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const search = (req.query.search as string) || "";
    const reps = await this._getAllRepsUseCase.execute(page, limit, search);
    res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: reps, page, limit });
  };
  blockUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updatedUser = await this._blockUserUseCase.execute(userId);

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: SuccessMessages.BLOCK_SUCCESS,
      updatedUser,
    });
  };
  unBlockUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updatedUser = await this._unblockUserUseCase.execute(userId);

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: SuccessMessages.UNBLOCK_SUCCESS,
      updatedUser,
    });
  };
  doctorDetails = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await this._getDoctorDetails.execute(userId);
    return res.status(HttpStatusCode.OK).json({ success: true, data: user });
  };
  repDetails = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await this._getMedicalRepDetails.execute(userId);
    return res.status(HttpStatusCode.OK).json({ success: true, data: user });
  };
  territories = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const response = await this._getTerritoriesUseCase.execute(userId,page,limit,search);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response,page,limit,search});
  };
  addTerritory = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const data = req.body as TerritorySchemaDTO;
    const response = await this._createTerritoryUseCase.execute(userId, data);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, message: response });
  };
  editTerritory = async (req: Request, res: Response) => {
    const { territoryId } = req.params;
    const userId = req.user?.userId;
    const data = req.body as TerritorySchemaDTO;
    const response = await this._edtiTerritoryUseCase.execute(
      territoryId,
      data,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };
  createDepartment = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const data = req.body as DepartmentSchemaDTO;
    const response = await this._createDepartmentUseCase.execute(userId, data);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ succes: true, message: response });
  };
  departments = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const search = (req.query.search as string) || "";
    console.log("search query:",search);
    const response = await this._getAllDepartmentsUseCase.execute(userId,page,limit,search);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response ,page,limit});
  };
  editDepartment = async (req: Request, res: Response) => {
    const { departmentId } = req.params;
    const userId = req.user?.userId;
    const data = req.body as DepartmentSchemaDTO;
    const response = await this._editDepartmentUseCase.execute(
      departmentId,
      data,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };
}
