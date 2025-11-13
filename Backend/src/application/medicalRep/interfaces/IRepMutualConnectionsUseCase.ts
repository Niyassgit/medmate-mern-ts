import { ConnectionsListOnModalDTO } from "../../doctor/dto/MutualConnectionListDTO";

export interface IRepMutualConnectionsUseCase{
    execute(userId:string):Promise<ConnectionsListOnModalDTO[]>;
}