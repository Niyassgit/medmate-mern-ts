import { IMedicalRepWithConnection } from "../../../domain/medicalRep/entities/IMedicalRepWithConnection";
import { IMedicalRepWithUser } from "../../../domain/medicalRep/entities/IMedicalRepWithUser";
import { ConnectionInitiator, ConnectionStatus } from "../../../shared/Enums";


export class RepNetworkEvaluator {
  static evaluate(
    reps: IMedicalRepWithUser[],
    connections: { doctorId: string; repId?: string; status: string; initiator: string }[]
  ): IMedicalRepWithConnection[] {
    const results: IMedicalRepWithConnection[] = [];

    for (const rep of reps) {
      const connection = connections.find((c) => c.doctorId === rep.id || c.repId === rep.id);

      if (!connection) {
        results.push({ ...rep, connectionStatus: null, connectionInitiator: null });
        continue;
      }

      if (connection.status === ConnectionStatus.ACCEPTED) continue;

      if (
        connection.status === ConnectionStatus.PENDING &&
        connection.initiator === ConnectionInitiator.DOCTOR
      )
        continue;

      if (
        connection.status === ConnectionStatus.PENDING &&
        connection.initiator === ConnectionInitiator.REP
      ) {
        results.push({
          ...rep,
          connectionStatus: connection.status,
          connectionInitiator: connection.initiator,
        });
      }
    }

    return results;
  }
}
