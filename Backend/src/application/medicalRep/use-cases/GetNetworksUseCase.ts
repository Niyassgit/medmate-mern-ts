import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ConnectionInitiator, ConnectionStatus } from "../../../shared/Enums";
import { ErrorMessages } from "../../../shared/Messages";
import { DoctorNetworkCardDTO } from "../dto/DocrtorNetworkCardDTO";
import { IGetNetworksUseCase } from "../interfaces/IGetNetWorksUseCase";
import { NetworkMapper } from "../mapper/NetworkMapper";

export class GetNetworksUseCase implements IGetNetworksUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _storageService: IStorageService,
    private _connectionRepository: IConnectionRepository
  ) {}
  async execute(userId: string): Promise<DoctorNetworkCardDTO[] | null> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const rep = await this._medicalRepRepository.getMedicalRepByUserId(userId);
    if (!rep) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { territories, departmentId } = rep;
    const doctors = await this._doctorRepository.findByTerritoryAndDepartment(
      departmentId,
      territories
    );
    if (!doctors) return null;
    const connections = await this._connectionRepository.findConnectionsForRep(
      rep.id
    );
    let result = [];
    for (const doc of doctors) {
      const connection = connections.find((conn) => conn.doctorId === doc.id);
      if (!connection) {
        result.push(
          await NetworkMapper.toResponse(doc, this._storageService, null, null)
        );
        continue;
      }
      if (connection.status === ConnectionStatus.ACCEPTED) continue;
      if (
        connection.status === ConnectionStatus.PENDING &&
        connection.initiator === ConnectionInitiator.REP
      )
        continue;
      if (
        connection.status === ConnectionStatus.PENDING &&
        connection.initiator === ConnectionInitiator.DOCTOR
      ) {
       result.push( await NetworkMapper.toResponse(
          doc,
          this._storageService,
          connection.status,
          connection.initiator
        ));
      }
    }
    return result.length > 0 ? result : null;
  }
}
