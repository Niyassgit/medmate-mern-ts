import { NetworkResponseDTO } from "../dto/NetworkResponseDTO";

export interface INetworkUseCase{
    execute(userId:string,search?:string):Promise<NetworkResponseDTO[] | null>;
}