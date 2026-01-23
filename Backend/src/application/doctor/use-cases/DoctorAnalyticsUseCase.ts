import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ConnectionMappers } from "../../common/mapper/ConnectionMappers";
import { NotFoundError } from "../../errors";
import { AnalyticsResponseDTO } from "../dto/AnalyticsResponseDTO";
import { IDoctorAnalyticsUseCase } from "../interfaces/IDoctorAnalyticsUseCase";

export class DoctorAnalyticsUseCase implements IDoctorAnalyticsUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _conectionRepository: IConnectionRepository,
    private _departmentRepository: IDepartmentRepository,
    private _storageService: IStorageService
  ) { }
  async execute(userId: string): Promise<AnalyticsResponseDTO | null> {
    const user = await this._doctorRepository.getDoctorIdByUserId(userId);
    if (!user || !user.doctorId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const mutualConnections =
      (await this._conectionRepository.doctorMutualConnections(
        user.doctorId
      )) ?? [];
    const pendingConnections =
      (await this._conectionRepository.pendingConnectionForDoctor(
        user.doctorId
      )) ?? [];

    if (mutualConnections.length === 0 && pendingConnections.length === 0) {
      return {
        mutualConnectionsCount: 0,
        pendingRequestCount: 0,
        mutualConnections: [],
      };
    }
    const enrichedConnections = await ConnectionMappers.enrichConnectionForDoctor(
      mutualConnections,
      this._departmentRepository,
      this._storageService
    );
    const mappedMutualConnections =
      ConnectionMappers.toDoctorDomainAnalticsList(enrichedConnections);
    return {
      mutualConnectionsCount: mutualConnections?.length,
      pendingRequestCount: pendingConnections?.length,
      mutualConnections: mappedMutualConnections,
    };
  }
}
