import { Request, Response } from "express";
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
import { ICreateTerritoryUseCase } from "../../../application/territory/interfaces/ICreateTerritoryUseCase";
import { TerritorySchemaDTO } from "../validators/TerritoryValidateSchema";
import { IEditTerritoryUseCase } from "../../../application/territory/interfaces/IEditTerritoryUseCase";
import { DepartmentSchemaDTO } from "../validators/DepartmentShema";
import { ICreateDepartmentUseCase } from "../../../application/department/interfaces/ICreateDepartmentUseCase";
import { IGetAllDepartmentsUseCase } from "../../../application/superAdmin/interfaces/IGetAllDepartmentsUseCase";
import { IEditDepartmentUseCase } from "../../../application/department/interfaces/IEditDepartmentUseCase";
import { GetOptionalUserId } from "../utils/GetOptionalUserId";
import { IGetAllSubscriptionsUseCase } from "../../../application/subscription/interfaces/IGetAllSubscriptionsUseCase";
import { ICreateSubscriptionPlanUseCase } from "../../../application/subscription/interfaces/ICreateSubscriptionPlanUseCase";
import { IUpdateSubscriptionPlanUseCase } from "../../../application/subscription/interfaces/IUpdateSubscriptionPlanUseCase";
import { CreateSubscriptionDTO } from "../../../application/subscription/dto/CreateSubscriptionDTO";
import { IListToggleSubscriptionPlanUseCase } from "../../../application/subscription/interfaces/IListToggleSubscriptionPlanUseCase";
import { IDeleteSubscriptionUseCase } from "../../../application/subscription/interfaces/IDeleteSubscriptionUseCase";
import { IGetAdminDashBoardSummaryUseCase } from "../../../application/superAdmin/interfaces/IGetAdminDashboardSummaryUseCase";

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
    private _editDepartmentUseCase: IEditDepartmentUseCase,
    private _getAllSubcriptionPlanUseCase: IGetAllSubscriptionsUseCase,
    private _createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,
    private _updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,
    private _toggleSubscriptionStatusUseCase: IListToggleSubscriptionPlanUseCase,
    private _deleteSubscriptionPlanUseCase: IDeleteSubscriptionUseCase,
    private _getAdminDashboardSummaryUseCase: IGetAdminDashBoardSummaryUseCase
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
    const response = await this._getTerritoriesUseCase.execute(
      userId,
      page,
      limit,
      search
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response, page, limit, search });
  };

  addTerritory = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const data = req.body as TerritorySchemaDTO;
    const response = await this._createTerritoryUseCase.execute(data, userId);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, message: response });
  };

  editTerritory = async (req: Request, res: Response) => {
    const { territoryId } = req.params;
    const userId = GetOptionalUserId(req.user);
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
    const userId = GetOptionalUserId(req.user);
    const data = req.body as DepartmentSchemaDTO;
    const response = await this._createDepartmentUseCase.execute(data, userId);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ succes: true, message: response });
  };

  departments = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const search = (req.query.search as string) || "";
    const response = await this._getAllDepartmentsUseCase.execute(
      userId,
      page,
      limit,
      search
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response, page, limit });
  };

  editDepartment = async (req: Request, res: Response) => {
    const { departmentId } = req.params;
    const userId = GetOptionalUserId(req.user);
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

  getAllSubscriptionPlan = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const response = await this._getAllSubcriptionPlanUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  createSubscriptionPlan = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const dto = req.body as CreateSubscriptionDTO;
    const response = await this._createSubscriptionPlanUseCase.execute(
      dto,
      userId
    );
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, data: response });
  };

  subscriptionUpdate = async (req: Request, res: Response) => {
    const { subscriptionId } = req.params;
    const dto = req.body as CreateSubscriptionDTO;
    const userId = GetOptionalUserId(req.user);
    const response = await this._updateSubscriptionPlanUseCase.execute(
      subscriptionId,
      dto,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  subscriptionListToggle = async (req: Request, res: Response) => {
    const { subscriptionId } = req.params;
    const userId = GetOptionalUserId(req.user);
    const response = await this._toggleSubscriptionStatusUseCase.execute(
      subscriptionId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  deleteSubscriptionPlan = async (req: Request, res: Response) => {
    const { subscriptionId } = req.params;
    const userId = GetOptionalUserId(req.user);

    const response = await this._deleteSubscriptionPlanUseCase.execute(
      subscriptionId,
      userId
    );

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: response,
    });
  };

  getStatsSummary = async (req: Request, res: Response) => {
    const userId =  GetOptionalUserId(req.user);
    const { startDate, endDate } = req.query;
    const response = await this._getAdminDashboardSummaryUseCase.execute(
      userId,
      startDate as string | undefined,
      endDate as string | undefined
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };
}
