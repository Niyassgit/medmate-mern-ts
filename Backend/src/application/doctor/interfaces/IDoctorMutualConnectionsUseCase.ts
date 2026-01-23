import { ConnectionsListOnModalDTO } from "../dto/MutualConnectionListDTO";

export interface IDoctorMutualConnectionsUseCase {
    execute(userId: string): Promise<ConnectionsListOnModalDTO[]>;
}