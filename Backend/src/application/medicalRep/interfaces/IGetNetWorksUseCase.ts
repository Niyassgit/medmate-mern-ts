import { DoctorNetworkCardDTO } from "../dto/DocrtorNetworkCardDTO";

export interface IGetNetworksUseCase{
    execute(userId:string,search?:string):Promise<DoctorNetworkCardDTO[] | null>
}