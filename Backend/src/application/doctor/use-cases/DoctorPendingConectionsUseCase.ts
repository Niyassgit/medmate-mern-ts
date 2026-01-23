import { UnautharizedError } from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ConnectionMappers } from "../../common/mapper/ConnectionMappers";
import { ConnectionsListOnModalDTO } from "../dto/MutualConnectionListDTO";
import { IDoctorPendingConnectionsUseCase } from "../interfaces/IDoctorPendingConnectionsUseCase";

export class DoctorPendingConnectionsUseCase
    implements IDoctorPendingConnectionsUseCase {
    constructor(
        private _doctorRepository: IDoctorRepository,
        private _connectionRepository: IConnectionRepository,
        private _storageService: IStorageService
    ) { }

    async execute(userId: string): Promise<ConnectionsListOnModalDTO[]> {
        const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
            userId
        );
        if (!doctorId)
            throw new UnautharizedError(ErrorMessages.UNAUTHERIZED_SOCKET);

        const pendingConnections =
            await this._connectionRepository.pendingConnectionForDoctor(doctorId);

        if (!pendingConnections) {
            return [];
        }

        return ConnectionMappers.toConnectionListModal(
            pendingConnections,
            this._storageService
        );
    }
}