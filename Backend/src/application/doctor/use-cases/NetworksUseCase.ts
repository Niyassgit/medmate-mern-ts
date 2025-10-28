import { NetworkResponseDTO } from "../dto/NetworkResponseDTO";
import { INetworkUseCase } from "../interfaces/INetworkUseCase";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { NotFoundError } from "../../../domain/common/errors";
import { ErrorMessages } from "../../../shared/Messages";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import {
  ConnectionInitiator,
  ConnectionStatus,
  Role,
} from "../../../shared/Enums";
import { UnautharizedError } from "../../errors";
import { NetworkMapper } from "../mapper/NetWorkMapper";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";

export class NetworksUseCase implements INetworkUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _storageService: IStorageService,
    private _connectionRepository: IConnectionRepository
  ) {}
  async execute(userId: string): Promise<NetworkResponseDTO[] | null> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    if (user.role !== Role.DOCTOR)
      throw new UnautharizedError(ErrorMessages.DOCTOR_ACCESS);
    const doctor = await this._doctorRepository.getDoctorByUserId(userId);
    if (!doctor) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { territoryId, departmentId } = doctor;
    const reps = await this._medicalRepRepository.findByTerritoryAndDepartment(
      territoryId,
      departmentId
    );
    if (!reps) return null;
    const connections =
      await this._connectionRepository.findConnectionsForDoctor(doctor.id);
    const result = [];
    for (const rep of reps) {
      const connection = connections.find(
        (conn) => conn.repId === rep.id && conn.doctorId === doctor.id
      );

      if (!connection) {
        result.push(
          await NetworkMapper.toResponse(rep, this._storageService, null, null)
        );
        continue;
      }
      if (connection.status === ConnectionStatus.ACCEPTED) continue;
      if (
        connection.status === ConnectionStatus.PENDING &&
        connection.initiator === ConnectionInitiator.DOCTOR
      )
        continue;
      if (
        connection.status === ConnectionStatus.PENDING &&
        connection.initiator === ConnectionInitiator.REP
      ) {
        result.push(
          await NetworkMapper.toResponse(
            rep,
            this._storageService,
            connection.status,
            connection.initiator
          )
        );
      }
    }
    return result.length > 0 ? result : null;
  }
}
