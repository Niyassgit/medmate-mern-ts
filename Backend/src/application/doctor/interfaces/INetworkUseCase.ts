import { NetworkResponseDTO } from "../dto/NetworkResponseDTO";

export interface INetworkUseCase{
    execute(userId:string):Promise<NetworkResponseDTO[] | null>;
}