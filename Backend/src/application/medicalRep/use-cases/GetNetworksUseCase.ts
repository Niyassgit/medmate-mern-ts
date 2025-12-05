import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { DoctorNetworkCardDTO } from "../dto/DocrtorNetworkCardDTO";
import { IGetNetworksUseCase } from "../interfaces/IGetNetWorksUseCase";
import { NetworkMapper } from "../mapper/NetworkMapper";
import { DoctorFilterService } from "../services/DoctorFilterService";
import { NetworkEvaluator } from "../services/NetworkEvaluator";

export class GetNetworksUseCase implements IGetNetworksUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _storageService: IStorageService,
    private _connectionRepository: IConnectionRepository
  ) {}
  async execute(
    userId: string,
    search?: string,
    filters?: { opTime?: string; minAge?: number; maxAge?: number }
  ): Promise<DoctorNetworkCardDTO[] | null> {
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
    const filteredDoctor = DoctorFilterService.apply(doctors, search, filters);
    const connections = await this._connectionRepository.findConnectionsForRep(
      rep.id
    );
    const evaluatedDoctors = NetworkEvaluator.evaluate(
      filteredDoctor,
      connections
    );
    return evaluatedDoctors.length
      ? await Promise.all(
          evaluatedDoctors.map((doc) =>
            NetworkMapper.toResponse(
              doc,
              this._storageService,
              doc.connectionStatus,
              doc.connectionInitiator
            )
          )
        )
      : null;
  }
}
