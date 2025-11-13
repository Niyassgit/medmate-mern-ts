import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ConnectionMappers } from "../../common/mapper/ConnectionMappers";
import { ConnectionsListOnModalDTO } from "../../doctor/dto/MutualConnectionListDTO";
import { UnautharizedError } from "../../errors";
import { IRepMutualConnectionsUseCase } from "../interfaces/IRepMutualConnectionsUseCase";

export class RepPendingConnectionsUseCase
  implements IRepMutualConnectionsUseCase
{
  constructor(
    private _medicalRepRepositry: IMedicalRepRepository,
    private _connetionRepository: IConnectionRepository,
    private _storageService: IStorageService
  ) {}
  async execute(userId: string): Promise<ConnectionsListOnModalDTO[]> {
    const { repId } = await this._medicalRepRepositry.getRepIdByUserId(userId);
    if (!repId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const pendingConnetions =
      await this._connetionRepository.pendingRequestsForRep(repId);
    if (!pendingConnetions) return [];
    return ConnectionMappers.toConnectionListModal(
      pendingConnetions,
      this._storageService
    );
  }
}
