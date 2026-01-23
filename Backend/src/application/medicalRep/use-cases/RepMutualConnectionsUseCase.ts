import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ConnectionMappers } from "../../common/mapper/ConnectionMappers";
import { ConnectionsListOnModalDTO } from "../../doctor/dto/MutualConnectionListDTO";
import { UnautharizedError } from "../../errors";
import { IRepMutualConnectionsUseCase } from "../interfaces/IRepMutualConnectionsUseCase";

export class RepMutualConnectionsUseCase
  implements IRepMutualConnectionsUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _connectionRepository: IConnectionRepository,
    private _storageService: IStorageService
  ) { }

  async execute(userId: string): Promise<ConnectionsListOnModalDTO[]> {
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const mutualConnections =
      await this._connectionRepository.repMutualConnections(repId);

    if (!mutualConnections) {
      return [];
    }

    return ConnectionMappers.toConnectionListModal(
      mutualConnections,
      this._storageService
    );
  }
}
