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
import { IGetUserDistributionUseCase } from "../../../application/superAdmin/interfaces/IGetUserDistributionUseCase";
import { IGetUserGrowthUseCase } from "../../../application/superAdmin/interfaces/IGetUserGrowthUseCase";
import { IGetRevenueByTierUseCase } from "../../../application/superAdmin/interfaces/IGetRevenueByTierUseCase";
import { IGetRecentSubscriptionsUseCase } from "../../../application/superAdmin/interfaces/IGetRecentSubscriptionsUseCase";
import { IGetSubscribedListUseCase } from "../../../application/superAdmin/interfaces/IGetSubscribedListUseCase";
import { IGetAllGuestsUseCase } from "../../../application/superAdmin/interfaces/IGetAllGuestsUseCase";
import { ITerritoryDetailsUseCase } from "../../../application/superAdmin/interfaces/ITerritoryDetailsUseCase";
import { IAdminOrderAnalyticsUseCase } from "../../../application/superAdmin/interfaces/IAdminOrderAnalyticsUseCase";
import { IGetDoctorEarningsUseCase } from "../../../application/superAdmin/interfaces/IGetDoctorEarningsUseCase";

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
    private _getAdminDashboardSummaryUseCase: IGetAdminDashBoardSummaryUseCase,
    private _getUserDistributionUseCase: IGetUserDistributionUseCase,
    private _getUserGrowthUseCase: IGetUserGrowthUseCase,
    private _getRevenueByTierUseCase: IGetRevenueByTierUseCase,
    private _getRecentSubscriptionsUseCase: IGetRecentSubscriptionsUseCase,
    private _getSubscribedListUseCase: IGetSubscribedListUseCase,
    private _getAllGuestsUseCase: IGetAllGuestsUseCase,
    private _getTerritoryDetailsUseCase: ITerritoryDetailsUseCase,
    private _adminOrderAnalyticsUseCase: IAdminOrderAnalyticsUseCase,
    private _getDoctorEarningsUseCase: IGetDoctorEarningsUseCase
  ) { }

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
    const territory = (req.query.territory as string) || "";
    const doctors = await this._getAllDoctorsUseCase.execute(
      page,
      limit,
      search,
      territory
    );
    res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: doctors, page, limit });
  };

  getAllReps = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const search = (req.query.search as string) || "";
    const territory = (req.query.territory as string) || "";
    const reps = await this._getAllRepsUseCase.execute(
      page,
      limit,
      search,
      territory
    );
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
    const userId = GetOptionalUserId(req.user);
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

  userDistribution = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { startDate, endDate } = req.query;
    const response = await this._getUserDistributionUseCase.execute(
      userId,
      startDate as string | undefined,
      endDate as string | undefined
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  userGrowth = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { year } = req.query;
    const response = await this._getUserGrowthUseCase.execute(
      userId,
      year as string | undefined
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  revenueByTier = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { startDate, endDate } = req.query;
    const response = await this._getRevenueByTierUseCase.execute(
      userId,
      startDate as string | undefined,
      endDate as string | undefined
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  recentSubscriptions = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string) : 20;
    const response = await this._getRecentSubscriptionsUseCase.execute(
      userId,
      parsedLimit
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  subscribedList = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { page, limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string) : 10;
    const parsedPage = page ? parseInt(page as string) : 1;

    const response = await this._getSubscribedListUseCase.execute(
      userId,
      parsedPage,
      parsedLimit
    );

    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  getAllGuests = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const territory = (req.query.territory as string) || "";

    const guests = await this._getAllGuestsUseCase.execute(
      page,
      limit,
      search,
      territory
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: guests, page, limit });
  };

  territoryDetails = async (req: Request, res: Response) => {
    const { territoryId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const response = await this._getTerritoryDetailsUseCase.execute(
      territoryId,
      page,
      limit
    );

    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response, page, limit });
  };

  orderAnalytics = async (req: Request, res: Response) => {
    const userId = "68cd786319d4bed25bc01763";

    // GetOptionalUserId(req.user);
    const { startDate, endDate } = req.query;
    const response = await this._adminOrderAnalyticsUseCase.execute(
      startDate as string,
      endDate as string,
      userId
    );

    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  doctorEarnings = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { startDate, endDate } = req.query;

    const response = await this._getDoctorEarningsUseCase.execute(
      page,
      limit,
      startDate as string,
      endDate as string
    );

    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response, page, limit });
  };
}
