import { ConnectionStatus } from "../../../shared/Enums";
import { ConnectionInitiator } from "../../../shared/Enums";


export interface IConnection{
    id:string;
    doctorId:string;
    repId:string;
    status:ConnectionStatus,
    initiator:ConnectionInitiator,
    createdAt:Date;
    updatedAt:Date;
}