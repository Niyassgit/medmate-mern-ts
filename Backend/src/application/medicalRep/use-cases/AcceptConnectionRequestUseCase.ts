import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ConnectionStatus } from "../../../shared/Enums";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, NotFoundError } from "../../errors";
import { IAcceptConnectionRequestUseCase } from "../interfaces/IAcceptConnectionRequestUseCase";

export class AcceptingConnectionRequest
  implements IAcceptConnectionRequestUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository
  ) {}
  async execute(doctorId: string, userId?: string): Promise<string> {
    if (!userId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const rep = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!rep || !rep.repId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const doctor = await this._doctorRepository.existById(doctorId);
    if (!doctor) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const connection = await this._connectionRepository.findByDoctorAndRep(
      doctorId,
      rep.repId
    );
    if (!connection || connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestError(ErrorMessages.NO_PENDING_REQ);
    }
    await this._connectionRepository.updateStatus(
      doctorId,
      rep.repId,
      ConnectionStatus.ACCEPTED
    );
    return SuccessMessages.CONNECTED;
  }
}
