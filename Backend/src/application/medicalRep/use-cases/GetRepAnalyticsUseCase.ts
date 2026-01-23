import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ConnectionMappers } from "../../common/mapper/ConnectionMappers";
import { NotFoundError } from "../../errors";
import { AnalyticsDTO } from "../dto/AnalyticsDTO";
import { IGetRepAnalyticsUseCase } from "../interfaces/IGetRepAnalyticsUseCase";

export class GetRepAnalyticsUseCase implements IGetRepAnalyticsUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _connectionRepository: IConnectionRepository,
    private _departmentRepository: IDepartmentRepository,
    private _territoryRepository: ITerritoryRepository,
    private _storageService: IStorageService
  ) { }

  async execute(userId: string): Promise<AnalyticsDTO | null> {
    const user = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!user || !user.repId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const mutualConnections =
      await this._connectionRepository.repMutualConnections(user.repId);

    const pendingRequestCount =
      await this._connectionRepository.countPendingRequestsForRep(user.repId);
    const mutualConnectionsCount =
      await this._connectionRepository.countMutualConnectionsForRep(user.repId);

    if (mutualConnections.length === 0) {
      return {
        mutualConnectionsCount,
        pendingRequestCount,
        mutualConnections: [],
      };
    }
    const enrichedConnections = await ConnectionMappers.enrichConnectionsForRep(
      mutualConnections,
      this._departmentRepository,
      this._territoryRepository,
      this._storageService
    );
    const mappedMutualConnections =
      ConnectionMappers.toRepDomainAnalticsList(enrichedConnections);

    return {
      mutualConnectionsCount,
      pendingRequestCount,
      mutualConnections: mappedMutualConnections,
    };
  }
}
