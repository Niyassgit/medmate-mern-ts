import { ConnectionsListOnModalDTO } from "../dto/MutualConnectionListDTO";

export interface IDoctorPendingConnectionsUseCase {
    execute(userId: string): Promise<ConnectionsListOnModalDTO[]>;
}