import { Request, Response } from "express";
import { IGetAllDepartmentOptionsUseCase } from "../../../application/department/interfaces/IGetAllDepartmentOptionsUseCase";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { IGetAllTerritoryOptionsUseCase } from "../../../application/territory/interfaces/IGetAllTerritoryOptionsUseCase";
import { IDoctorsPreviewUseCase } from "../../../application/doctor/interfaces/IDoctorsPreviewCardUseCase";

export class CommonController {
  constructor(
    private _getAlldepartmentOptionsUseCase: IGetAllDepartmentOptionsUseCase,
    private _getAllTerritoryOptionsUseCase: IGetAllTerritoryOptionsUseCase,
    private _doctorPreviewForGuestUseCase: IDoctorsPreviewUseCase
  ) {}

  departments = async (req: Request, res: Response) => {
    const response = await this._getAlldepartmentOptionsUseCase.execute();
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };
  territories = async (req: Request, res: Response) => {
    const response = await this._getAllTerritoryOptionsUseCase.execute();
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };
  doctorsList = async (req: Request, res: Response) => {
    const response = await this._doctorPreviewForGuestUseCase.execute();
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };
}
  