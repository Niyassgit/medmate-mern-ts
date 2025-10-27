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
    private _territoryRepository: ITerritoryRepository
  ) {}
  async execute(userId: string): Promise<AnalyticsDTO | null> {
    const user = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!user || !user.repId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const mutualConnections =
      (await this._connectionRepository.repMutualConnections(user.repId)) ?? [];
    const pendingConnections =
      (await this._connectionRepository.pendingRequestsForRep(user.repId)) ?? [];


    if (mutualConnections.length === 0 && pendingConnections.length === 0) {
      return {
        mutualConnectionsCount: 0,
        pendingRequestCount: 0,
        mutualConnections: [],
      };
    }
    const enrichedConnections = await Promise.all(
      mutualConnections.map(async (doctor) => {
        const department = doctor.departmentId
          ? await this._departmentRepository.getDepartmentName(
              doctor.departmentId
            )
          : null;
        const territory = doctor.territoryId
          ? await this._territoryRepository.getTerritoryName(doctor.territoryId)
          : null;
        return {
          ...doctor,
          departmentName: department ?? "",
          territoryName: territory ?? "",
        };
      })
    );
    const mappedMutualConnections =
      ConnectionMappers.toRepDomainAnalticsList(enrichedConnections);
    return {
      mutualConnectionsCount: mutualConnections.length,
      pendingRequestCount: pendingConnections.length,
      mutualConnections: mappedMutualConnections,
    };
  }
}
