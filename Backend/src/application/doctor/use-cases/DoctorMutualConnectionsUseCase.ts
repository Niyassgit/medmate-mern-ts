import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ConnectionMappers } from "../../common/mapper/ConnectionMappers";
import { UnautharizedError } from "../../errors";
import { ConnectionsListOnModalDTO } from "../dto/MutualConnectionListDTO";
import { IDoctorMutualConnectionsUseCase } from "../interfaces/IDoctorMutualConnectionsUseCase";

export class DoctorMutualConnectionsUseCase
  implements IDoctorMutualConnectionsUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _storageService: IStorageService
  ) {}
  async execute(userId: string): Promise<ConnectionsListOnModalDTO[]> {
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId)
      throw new UnautharizedError(ErrorMessages.UNAUTHERIZED_SOCKET);
    const mutualCennectedReps =
      await this._connectionRepository.doctorMutualConnections(doctorId);
    if (!mutualCennectedReps) return [];
    return ConnectionMappers.toConnectionListModal(
      mutualCennectedReps,
      this._storageService
    );
  }
}
