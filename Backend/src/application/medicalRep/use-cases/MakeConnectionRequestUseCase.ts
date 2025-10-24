import { NotFoundError } from "../../../domain/common/errors";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ConnectionInitiator, ConnectionStatus } from "../../../shared/Enums";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError } from "../../errors";
import { IMakeConnectionRequestUseCase } from "../interfaces/IMakeConnectionRequestUseCase";

export class MakeConnectionRequestUseCase
  implements IMakeConnectionRequestUseCase
{
  constructor(
    private _medicalRepReposritory: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository
  ) {}
  async execute(doctorId: string, userId?: string): Promise<string> {
    if (!userId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const rep = await this._medicalRepReposritory.getRepIdByUserId(userId);
    if (!rep || !rep.repId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const doctor = await this._doctorRepository.existById(doctorId);
    if (!doctor) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const existingConnection =
      await this._connectionRepository.findByDoctorAndRep(doctorId, rep.repId);

    if (existingConnection) {
      if (existingConnection.status === ConnectionStatus.PENDING) {
        await this._connectionRepository.deleteByDoctorAndRep(
          doctorId,
          rep.repId
        );
        return SuccessMessages.CANCEL_CONNECTION_REQ;
      }
      if (existingConnection.status === ConnectionStatus.ACCEPTED) {
        return ErrorMessages.ALREADY_CONNECTED;
      }
    }
    const requestRes = await this._connectionRepository.createConnection(
      rep.repId,
      doctorId,
      ConnectionInitiator.REP
    );
    if (!requestRes)
      throw new BadRequestError(ErrorMessages.CONNECTION_REQUEST);
    return SuccessMessages.CONNECTION_REQUEST;
  }
}
