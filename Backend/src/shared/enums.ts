export enum AuthProvider {
  NATIVE = "NATIVE",
  GOOGLE = "GOOGLE",
}
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  DOCTOR = "DOCTOR",
  MEDICAL_REP = "MEDICAL_REP",
}

export enum ConnectionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export enum ConnectionInitiator {
  DOCTOR = "DOCTOR",
  REP = "REP",
}