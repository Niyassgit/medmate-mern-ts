import { IConnectionRepository } from "../../domain/connection/repositories/IConnectionRepository";
import { BaseRepository } from "../database/BaseRepository";
import { IConnection } from "../../domain/connection/entities/IConnection";
import { Connection, Prisma } from "@prisma/client";
import {
  ConnectionStatus as PrismaStatus,
  ConnectionInitiator as PrismaIntiator,
} from "@prisma/client";
import { ConnectionMappers } from "../mappers/ConnectionMappers";
import { prisma } from "../config/db";
import { ConnectionInitiator, ConnectionStatus } from "../../shared/Enums";
import { IDoctorListOnRep } from "../../domain/doctor/entities/IDoctorListOnRep";
import { DoctorMapper } from "../mappers/DoctorMapper";
import { IMedicalRepListOnDoc } from "../../domain/medicalRep/entities/IMedicalRepListOnDoc";
import { MedicalRepMapper } from "../mappers/MedicalRepMapper";

export class ConnectionRepository
  extends BaseRepository<
    IConnection,
    Connection,
    Prisma.ConnectionCreateInput,
    "connection"
  >
  implements IConnectionRepository
{
  constructor() {
    super(prisma.connection, (connect) => ConnectionMappers.toDomain(connect));
  }

  async findByDoctorAndRep(
    doctorId: string,
    repId: string
  ): Promise<IConnection | null> {
    const connection = await prisma.connection.findUnique({
      where: { doctorId_repId: { doctorId, repId } },
    });
    if (!connection) return null;
    return ConnectionMappers.toDomain(connection);
  }

  async createConnection(
    doctorId: string,
    repId: string,
    initiator: ConnectionInitiator
  ): Promise<IConnection> {
    const connection = await prisma.connection.create({
      data: {
        doctorId,
        repId,
        initiator: initiator as PrismaIntiator,
        status: PrismaStatus.PENDING,
      },
    });
    return ConnectionMappers.toDomain(connection);
  }

  async updateStatus(
    doctorId: string,
    repId: string,
    status: ConnectionStatus
  ): Promise<IConnection> {
    const updated = await prisma.connection.update({
      where: { doctorId_repId: { doctorId, repId } },
      data: { status },
    });
    return ConnectionMappers.toDomain(updated);
  }

  async deleteByDoctorAndRep(doctorId: string, repId: string): Promise<void> {
    await prisma.connection.delete({
      where: { doctorId_repId: { doctorId, repId } },
    });
  }

  async findConnectionsForRep(repId: string): Promise<IConnection[]> {
    const connections = await prisma.connection.findMany({
      where: { repId },
    });
    return ConnectionMappers.toListConnections(connections);
  }
  async getAll(): Promise<IConnection[]> {
    const resp = await this.findAll();
    return resp;
  }
  async findConnectionsForDoctor(doctorId: string): Promise<IConnection[]> {
    const connections = await prisma.connection.findMany({
      where: { doctorId },
    });
    return ConnectionMappers.toListConnections(connections);
  }

  async repMutualConnections(repId: string): Promise<IDoctorListOnRep[]> {
    const connections = await prisma.connection.findMany({
      where: { repId, status: ConnectionStatus.ACCEPTED },
      select: {
        doctor: {
          include: { user: true },
        },
      },
    });

    return connections.map((conn) => DoctorMapper.toListOnRep(conn.doctor));
  }

  async pendingRequestsForRep(repId: string): Promise<IDoctorListOnRep[]> {
    const pendingConnections = await prisma.connection.findMany({
      where: { repId, status: ConnectionStatus.PENDING },
      select: {
        doctor: {
          include: { user: true },
        },
      },
    });
    return pendingConnections.map((conn) =>
      DoctorMapper.toListOnRep(conn.doctor)
    );
  }
  async doctorMutualConnections(
    doctorId: string
  ): Promise<IMedicalRepListOnDoc[]> {
    const connections = await prisma.connection.findMany({
      where: { doctorId, status: ConnectionStatus.ACCEPTED },
      select: {
        rep: {
          include: { 
            user: true,
            department: true,
          },
        },
      },
    });
    return connections.map((conn) => MedicalRepMapper.toListOnDoctor(conn.rep));
  }
  async pendingConnectionForDoctor(
    doctorId: string
  ): Promise<IMedicalRepListOnDoc[]> {
    const pendingConnections = await prisma.connection.findMany({
      where: { doctorId, status: ConnectionStatus.PENDING },
      select: {
        rep: {
          include: { user: true },
        },
      },
    });
    return pendingConnections.map((conn) =>
      MedicalRepMapper.toListOnDoctor(conn.rep)
    );
  }
  async doctorMutualConnectionRepIds(doctorId: string): Promise<string[]> {
    const repIds = await prisma.connection.findMany({
      where: { doctorId },
      select: { repId: true },
    });
    return repIds.map((r) => r.repId);
  }

  async rejectConnectionByDoctorAndRepIds(
    doctorId: string,
    repId: string,
    status: ConnectionStatus
  ): Promise<boolean> {
    const result = await prisma.connection.update({
      where: { doctorId_repId: { doctorId, repId } },
      data: { status },
    });
    return !!result;
  }

  async findConnectionBetweenDoctorAndRep(
    doctorId: string,
    repId: string
  ): Promise<IConnection | null> {
    const result = await prisma.connection.findFirst({
      where: { doctorId, repId },
    });

    return result ?ConnectionMappers.toDomain(result):null;
  }
}
