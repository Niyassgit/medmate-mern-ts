import { Request, Response } from "express";
import { RegisterPatientDTO } from "../../../application/Patient/dto/RegisterPatientDTO";
import { ICreatePatientUseCase } from "../../../application/Patient/interefaces/ICreatePatientUseCase";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";

export class PatientController {
  constructor(private _createPatientUseCase: ICreatePatientUseCase) {}

  createPatient = async (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;

    const data: RegisterPatientDTO = {
      name,
      email,
      phone,
      password,
    };

    const response = await this._createPatientUseCase.execute(data);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ success: true, ...response });
  };
}
