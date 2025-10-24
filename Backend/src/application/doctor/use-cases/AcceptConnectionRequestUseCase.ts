import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ConnectionStatus } from "../../../shared/Enums";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../errors";
import { IAcceptConnectionRequestUseCase } from "../interfaces/IAcceptConnectionRequestUseCase";

export class AcceptConnectionRequestUseCase
  implements IAcceptConnectionRequestUseCase
{
  constructor(
    private _medicalRepRepositoy: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository
  ) {}
  async execute(repId: string, userId?: string): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const doctor = await this._doctorRepository.getDoctorIdByUserId(userId);
    if (!doctor || !doctor.doctorId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const rep = await this._medicalRepRepositoy.existById(repId);
    if (!rep) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const connection = await this._connectionRepository.findByDoctorAndRep(
      doctor.doctorId,
      repId
    );
    if (!connection || connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestError(ErrorMessages.NO_PENDING_REQ);
    }
    await this._connectionRepository.updateStatus(
      doctor.doctorId,
      repId,
      ConnectionStatus.ACCEPTED
    );
    return SuccessMessages.CONNECTED;
  }
}
