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
export enum NotificationType {
    CONNECTION_REQUEST="CONNECTION_REQUEST",
    CONNECTION_ACCEPTED="CONNECTION_ACCEPTED",
    CONNECTION_REJECT="CONNECTION_REJECTED",
    LIKE="LIKE",
    INTEREST="INTEREST"
}

export enum MessageType{
  TEXT="TEXT",
  IMAGE="IMAGE",
  AUDIO="AUDIO",
  VIDEO="VIDEO",
  FILE="FILE",
}

export enum StripePaymentStatus{
  PAID="PAID",
  UNPAID="UNPAID",
  NO_PAYMENT_REQUIRED="NO_PAYMENT_REQUIRED",  
}