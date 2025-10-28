import { DoctorNetworkCardDTO } from "../dto/DocrtorNetworkCardDTO";

export interface IGetNetworksUseCase{
    execute(userId:string):Promise<DoctorNetworkCardDTO[] | null>
}