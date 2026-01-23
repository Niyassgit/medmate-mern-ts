import { ConnectionsListOnModalDTO } from "../../doctor/dto/MutualConnectionListDTO";

export interface IRepPendingConnectionsUseCase {
    execute(userId: string): Promise<ConnectionsListOnModalDTO[]>;
}