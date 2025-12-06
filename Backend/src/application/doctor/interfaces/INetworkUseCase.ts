import { NetworkResponseDTO } from "../dto/NetworkResponseDTO";

export interface INetworkUseCase{
    execute(
        userId:string,
        search?:string,
        filters?: {
            company?: string;
            territories?: string[];
        }
    ):Promise<NetworkResponseDTO[] | null>;
}