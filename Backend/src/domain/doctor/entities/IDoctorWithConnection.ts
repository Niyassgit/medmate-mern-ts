import { IDoctorWithUser } from "./IDoctorWithUser";

export interface IDoctorWithConnection extends IDoctorWithUser {
  connectionStatus: string | null;
  connectionInitiator: string | null;
}
