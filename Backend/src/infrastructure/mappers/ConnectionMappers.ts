import { Connection, Prisma} from "@prisma/client";
import { IConnection } from "../../domain/connection/entities/IConnection";
import { ConnectionInitiator, ConnectionStatus } from "../../shared/Enums";

export class ConnectionMappers{
    static toDomain(persistance:Connection):IConnection{
        return{
            id:persistance.id,
            doctorId:persistance.doctorId,
            repId:persistance.repId,
            status:persistance.status as ConnectionStatus,
            initiator:persistance.initiator as ConnectionInitiator,
            createdAt:persistance.createdAt,
            updatedAt:persistance.updatedAt

        }
    }
    static toListConnections(persistance:Connection[]):IConnection[]{
        return persistance.map((connection)=>this.toDomain(connection));
    }
 
}