import { DoctorNetworkCardDTO } from "../dto/DocrtorNetworkCardDTO";

export interface IGetNetworksUseCase{
    execute(userId:string,search?:string, filters?: { opTime?: string; minAge?: number; maxAge?: number }):Promise<DoctorNetworkCardDTO[] | null>
}