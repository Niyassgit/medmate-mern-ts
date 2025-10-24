import { ConnectionInitiator, ConnectionStatus } from "../../../shared/Enums";
import { IConnection } from "../entities/IConnection";

export interface IConnectionRepository{
    findByDoctorAndRep(doctorId:string,repId:string):Promise<IConnection | null>;
    createConnection(
        doctorId:string,
        repId:string,
        initiator:ConnectionInitiator
    ):Promise<IConnection>;
    updateStatus(doctorId:string,repId:string,status:ConnectionStatus):Promise<IConnection>;
    deleteByDoctorAndRep(doctorId:string,repId:string):Promise<void>;
}