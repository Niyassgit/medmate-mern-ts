import { NetworkResponseDTO } from "../dto/NetworkResponseDTO";

export interface INetworkUseCase {
    execute(
        userId: string,
        search?: string,
        filters?: {
            company?: string;
            territories?: string[];
        },
        page?: number,
        limit?: number
    ): Promise<{ data: NetworkResponseDTO[]; total: number } | null>;
}
