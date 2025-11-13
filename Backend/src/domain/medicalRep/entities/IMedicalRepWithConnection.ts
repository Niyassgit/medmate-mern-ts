import { IMedicalRepWithUser } from "./IMedicalRepWithUser";

export interface IMedicalRepWithConnection extends IMedicalRepWithUser {
  connectionStatus: string | null;
  connectionInitiator: string | null;
}