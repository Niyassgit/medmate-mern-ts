import { DoctorNetworkCardDTO } from "../dto/DocrtorNetworkCardDTO";

export interface IGetNetworksUseCase {
    execute(
        userId: string,
        search?: string,
        filters?: { opTime?: string; minAge?: number; maxAge?: number },
        page?: number,
        limit?: number
    ): Promise<{ data: DoctorNetworkCardDTO[]; total: number } | null>;
}