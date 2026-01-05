import { IDoctorWithConnection } from "../../../domain/doctor/entities/IDoctorWithConnection";
import { IDoctorWithUser } from "../../../domain/doctor/entities/IDoctorWithUser";
import { ConnectionInitiator, ConnectionStatus } from "../../../shared/Enums";


export class NetworkEvaluator {
  static evaluate(
    doctors: IDoctorWithUser[],
    connections: { doctorId: string; status: ConnectionStatus; initiator: ConnectionInitiator }[]
    ): IDoctorWithConnection[] {
    const results: IDoctorWithConnection[] = [];

    for (const doc of doctors) {
      const connection = connections.find((c) => c.doctorId === doc.id);

      if (!connection) {
        results.push({ ...doc, connectionStatus: null, connectionInitiator: null });
        continue;
      }

      if (connection.status === ConnectionStatus.ACCEPTED) continue;
      if (
        connection.status === ConnectionStatus.PENDING &&
        connection.initiator === ConnectionInitiator.REP
      )
        continue;

      if (
        connection.status === ConnectionStatus.PENDING &&
        connection.initiator === ConnectionInitiator.DOCTOR
      ) {
        results.push({
          ...doc,
          connectionStatus: connection.status,
          connectionInitiator: connection.initiator,
        });
      }
    }

    return results;
  }
}
