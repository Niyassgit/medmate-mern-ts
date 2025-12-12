import { Request, Response } from "express";
import { RegisterGuestDTO } from "../../../application/Guest/dto/RegisterPatientDTO";
import { ICreateGuestUseCase } from "../../../application/Guest/interefaces/ICreateGuestUseCase";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { GetOptionalUserId } from "../utils/GetOptionalUserId";
import { IGetAllPrescriptionsUseCase } from "../../../application/Guest/interefaces/IGetAllPrescriptions";
import { IGetAllAddressUseCase } from "../../../application/Guest/interefaces/IGetAllAddressUseCase";
import { ICreateAddressUseCase } from "../../../application/Guest/interefaces/ICreateAddressUseCase";
import { AddressDTO } from "../../../application/Guest/dto/AddressDTO";

export class GuestController {
  constructor(
    private _createGuestUseCase: ICreateGuestUseCase,
    private _getAllPrescriptionsUseCase: IGetAllPrescriptionsUseCase,
    private _getAllAddressUseCase: IGetAllAddressUseCase,
    private _createAddressUseCase: ICreateAddressUseCase
  ) {}

  createGuest = async (req: Request, res: Response) => {
    const { name, email, phone, password, territoryId } = req.body;
    const shareToken =
      req.params.shareToken || (req.query.shareToken as string);
    const data: RegisterGuestDTO = {
      name,
      email,
      phone,
      password,
      territoryId,
      shareToken,
    };

    const response = await this._createGuestUseCase.execute(data);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, ...response });
  };

  getPrescriptions = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const response = await this._getAllPrescriptionsUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  createAddress = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const dto = req.body as AddressDTO;
    const response = await this._createAddressUseCase.execute(dto, userId);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, data: response });
  };

  getAllAddress = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const response = await this._getAllAddressUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };
}
