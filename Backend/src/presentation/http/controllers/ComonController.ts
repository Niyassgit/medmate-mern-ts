import { Request, Response } from "express";
import { IGetAllDepartmentOptionsUseCase } from "../../../application/department/interfaces/IGetAllDepartmentOptionsUseCase";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { IGetAllTerritoryOptionsUseCase } from "../../../application/territory/interfaces/IGetAllTerritoryOptionsUseCase";

export class CommonController {
  constructor(
    private _getAlldepartmentOptionsUseCase: IGetAllDepartmentOptionsUseCase,
    private _getAllTerritoryOptionsUseCase: IGetAllTerritoryOptionsUseCase
  ) {}

  departments = async (req: Request, res: Response) => {
    const resp = await this._getAlldepartmentOptionsUseCase.execute();
    return res.status(HttpStatusCode.OK).json({ success: true, data: resp });
  };
  territories = async (req: Request, res: Response) => {
    const resp = await this._getAllTerritoryOptionsUseCase.execute();
    return res.status(HttpStatusCode.OK).json({ success: true, data: resp });
  };
}
