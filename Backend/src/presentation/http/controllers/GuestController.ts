import { Request, Response } from "express";
import { RegisterGuestDTO } from "../../../application/Guest/dto/RegisterPatientDTO";
import { ICreateGuestUseCase } from "../../../application/Guest/interefaces/ICreateGuestUseCase";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { GetOptionalUserId } from "../utils/GetOptionalUserId";

export class GuestController {
  constructor(private _createGuestUseCase: ICreateGuestUseCase) {}

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
 
  getPrescriptions=async(req:Request,res:Response)=>{
    const userId=GetOptionalUserId(req.user);
    const response=await this.
  }
}
