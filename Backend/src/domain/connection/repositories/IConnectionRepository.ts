import { ConnectionInitiator, ConnectionStatus } from "../../../shared/Enums";
import { IDoctorListOnRep } from "../../doctor/entities/IDoctorListOnRep";
import { IMedicalRepListOnDoc } from "../../medicalRep/entities/IMedicalRepListOnDoc";
import { IConnection } from "../entities/IConnection";

export interface IConnectionRepository {
  findByDoctorAndRep(
    doctorId: string,
    repId: string
  ): Promise<IConnection | null>;
  createConnection(
    doctorId: string,
    repId: string,
    initiator: ConnectionInitiator
  ): Promise<IConnection>;
  updateStatus(
    doctorId: string,
    repId: string,
    status: ConnectionStatus
  ): Promise<IConnection>;
  rejectConnectionByDoctorAndRepIds(doctorId:string,repId:string,status:ConnectionStatus):Promise<boolean>;
  deleteByDoctorAndRep(doctorId: string, repId: string): Promise<void>;
  findConnectionsForRep(repId: string): Promise<IConnection[]>;
  findConnectionsForDoctor(doctorId: string): Promise<IConnection[]>;
  getAll(): Promise<IConnection[]>;
  repMutualConnections(repId: string): Promise<IDoctorListOnRep[]>;
  pendingRequestsForRep(repId: string): Promise<IDoctorListOnRep[]>;
  doctorMutualConnections(doctorId: string): Promise<IMedicalRepListOnDoc[]>;
  pendingConnectionForDoctor(doctorId: string): Promise<IMedicalRepListOnDoc[]>;
  doctorMutualConnectionRepIds(doctorId:string):Promise<string[]>;
}
