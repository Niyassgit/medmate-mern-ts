import { NotFoundError } from "../../../domain/common/errors";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ConnectionInitiator, ConnectionStatus } from "../../../shared/Enums";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { IConnectionRequestUseCase } from "../interfaces/IConnectionRequestUseCase";

export class ConnectionRequestUseCase implements IConnectionRequestUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _connectionRepository: IConnectionRepository
  ) {}

  async execute(repId: string, userId?: string): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const doctor = await this._doctorRepository.getDoctorIdByUserId(userId);
    if (!doctor || !doctor.doctorId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const rep = await this._medicalRepRepository.existById(repId);
    if (!rep) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const existingConnection =
      await this._connectionRepository.findByDoctorAndRep(
        doctor.doctorId,
        repId
      );
    if (existingConnection) {
      if (existingConnection.status === ConnectionStatus.PENDING) {
        await this._connectionRepository.deleteByDoctorAndRep(
          doctor.doctorId,
          repId
        );
        return SuccessMessages.CANCEL_CONNECTION_REQ;
      }
      if (existingConnection.status === ConnectionStatus.ACCEPTED) {
        return ErrorMessages.ALREADY_CONNECTED;
      }
    }
    const connection = await this._connectionRepository.createConnection(
      doctor.doctorId,
      repId,
      ConnectionInitiator.DOCTOR
    );
    if (!connection)
      throw new BadRequestError(ErrorMessages.CONNECTION_REQUEST);
    return SuccessMessages.CONNECTION_REQUEST;
  }
}
