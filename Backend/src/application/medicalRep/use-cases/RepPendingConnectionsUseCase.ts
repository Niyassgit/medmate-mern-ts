import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ConnectionMappers } from "../../common/mapper/ConnectionMappers";
import { ConnectionsListOnModalDTO } from "../../doctor/dto/MutualConnectionListDTO";
import { UnautharizedError } from "../../errors";
import { IRepPendingConnectionsUseCase } from "../interfaces/IRepPendingConnectionsUseCase";

export class RepPendingConnectionsUseCase
  implements IRepPendingConnectionsUseCase {
  constructor(
    private _medicalRepRepositry: IMedicalRepRepository,
    private _connetionRepository: IConnectionRepository,
    private _storageService: IStorageService
  ) { }

  async execute(userId: string): Promise<ConnectionsListOnModalDTO[]> {
    const { repId } = await this._medicalRepRepositry.getRepIdByUserId(userId);
    if (!repId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const pendingConnections =
      await this._connetionRepository.pendingRequestsForRep(repId);

    if (!pendingConnections) {
      return [];
    }

    return ConnectionMappers.toConnectionListModal(
      pendingConnections,
      this._storageService
    );
  }
}
