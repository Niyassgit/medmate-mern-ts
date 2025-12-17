import { Request, Response } from "express";
import { RegisterGuestDTO } from "../../../application/Guest/dto/RegisterPatientDTO";
import { IMakePaymentUseCase } from "../../../application/Guest/interefaces/IMakePaymentUseCase";
import { ICreateGuestUseCase } from "../../../application/Guest/interefaces/ICreateGuestUseCase";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { GetOptionalUserId } from "../utils/GetOptionalUserId";
import { IGetAllPrescriptionsUseCase } from "../../../application/Guest/interefaces/IGetAllPrescriptions";
import { IGetAllAddressUseCase } from "../../../application/Guest/interefaces/IGetAllAddressUseCase";
import { ICreateAddressUseCase } from "../../../application/Guest/interefaces/ICreateAddressUseCase";
import { AddressDTO } from "../../../application/Guest/dto/AddressDTO";
import { IDeleteAddressUseCase } from "../../../application/Guest/interefaces/IDeleteAddressUseCase";
import { IGetOrdersUseCase } from "../../../application/Guest/interefaces/IGetOrdersUseCase";
import { IGetOrderDetailUseCase } from "../../../application/Guest/interefaces/IGetOrderDetailUseCase";
import { IGetProfileDetailsUseCase } from "../../../application/Guest/interefaces/IGetProfileDetailsUseCase";
import { ICompleteGuestProfileUseCase } from "../../../application/Guest/interefaces/ICompleteGuestProfileUseCase";
import { GuestProfileCompleteDTO } from "../../../application/Guest/dto/ProfileCompleteDTO";
import { IChangePasswordUseCase } from "../../../application/common/interfaces/IChangePasswordUseCase";
import { Role } from "../../../shared/Enums";

export class GuestController {
  constructor(
    private _createGuestUseCase: ICreateGuestUseCase,
    private _getAllPrescriptionsUseCase: IGetAllPrescriptionsUseCase,
    private _getAllAddressUseCase: IGetAllAddressUseCase,
    private _createAddressUseCase: ICreateAddressUseCase,
    private _deleteAddressUseCase: IDeleteAddressUseCase,
    private _makePaymentUseCase: IMakePaymentUseCase,
    private _getodersUseCase: IGetOrdersUseCase,
    private _getOrderDetailUseCase: IGetOrderDetailUseCase,
    private _getProfileDetailsUseCase: IGetProfileDetailsUseCase,
    private _completeGuestProfileUseCase: ICompleteGuestProfileUseCase,
    private _changePasswordUseCase: IChangePasswordUseCase
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

  deleteAddress = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { addressId } = req.params;
    const response = await this._deleteAddressUseCase.execute(
      addressId,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };

  makePayment = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { prescriptionId, addressId, paymentMethod } = req.body;
    const response = await this._makePaymentUseCase.execute(
      prescriptionId,
      addressId,
      paymentMethod,
      userId
    );
    return res.status(HttpStatusCode.OK).json({ success: true, url: response });
  };

  getOrders = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const response = await this._getodersUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  getOrderDetails = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { orderId } = req.params;
    const response = await this._getOrderDetailUseCase.execute(orderId, userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  profile = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const response = await this._getProfileDetailsUseCase.execute(userId);
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: response });
  };

  completeProfile = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const dto = req.body as GuestProfileCompleteDTO;
    const response = await this._completeGuestProfileUseCase.execute(
      dto,
      userId
    );
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, data: response });
  };

  changePassword = async (req: Request, res: Response) => {
    const userId = GetOptionalUserId(req.user);
    const { role, newPassword } = req.query;
    const response = await this._changePasswordUseCase.execute(
      role as Role,
      newPassword as string,
      userId
    );
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: response });
  };
}
