import { IConnectionRepository } from "../../domain/connection/repositories/IConnectionRepository";
import { BaseRepository } from "../database/BaseRepository";
import { IConnection } from "../../domain/connection/entities/IConnection";
import { Connection,Prisma } from "@prisma/client";
import { ConnectionStatus as PrismaStatus ,ConnectionInitiator as PrismaIntiator, } from "@prisma/client";
import { ConnectionMappers } from "../mappers/ConnectionMappers";
import { prisma } from "../config/db";
import { ConnectionInitiator, ConnectionStatus } from "../../shared/Enums";


export class ConnectionRepository
  extends BaseRepository<
    IConnection,
    Connection,
    Prisma.ConnectionCreateInput,
    "connection"
  >
  implements IConnectionRepository
{

 constructor(){
    super(prisma.connection,(connect)=>ConnectionMappers.toDomain(connect));
 }


  async findByDoctorAndRep(
    doctorId: string,
    repId: string
  ): Promise<IConnection | null> {
     const connection=await prisma.connection.findUnique({
      where: { doctorId_repId: { doctorId, repId } },
    });
    if(!connection) return null;
    return ConnectionMappers.toDomain(connection);
  }

  async createConnection(
    doctorId: string,
    repId: string,
    initiator: ConnectionInitiator
  ): Promise<IConnection> {
   const connection= await prisma.connection.create({
    data:{
        doctorId,
        repId,
        initiator:initiator as PrismaIntiator,
        status:PrismaStatus.PENDING
    }
   });
   return ConnectionMappers.toDomain(connection);
   
  }

  async updateStatus(
    doctorId: string,
    repId: string,
    status: ConnectionStatus
  ): Promise<IConnection> {
   const updated=await prisma.connection.update({
    where:{doctorId_repId:{doctorId,repId}},
    data:{status}
   });
   return ConnectionMappers.toDomain(updated);
  } 
 
 async deleteByDoctorAndRep(doctorId: string, repId: string): Promise<void> {
      await prisma.connection.delete({
        where:{doctorId_repId:{doctorId,repId}}
      })
  }

}
