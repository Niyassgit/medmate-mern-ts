export enum AuthProvider {
  NATIVE = "NATIVE",
  GOOGLE = "GOOGLE",
}
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  DOCTOR = "DOCTOR",
  MEDICAL_REP = "MEDICAL_REP",
  GUEST = "GUEST",
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
  CONNECTION_REQUEST = "CONNECTION_REQUEST",
  CONNECTION_ACCEPTED = "CONNECTION_ACCEPTED",
  CONNECTION_REJECT = "CONNECTION_REJECTED",
  LIKE = "LIKE",
  INTEREST = "INTEREST",
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  FILE = "FILE",
}

export enum PrescriptionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  USED = "USED",
  EXPIRED = "EXPIRED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum AddressType {
  HOME = "HOME",
  WORK = "WORK",
  OTHER = "OTHER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum ProductPostListStatus {
  ALL = "ALL",
  PUBLISHED = "PUBLISHED",
  ARCHIVE = "ARCHIVE",
}

export enum CommissionStatus {
  PENDING = "PENDING",
  SETTLED = "SETTLED",
}

export enum Feature{
  VIDEO_CALL="VIDEO_CALL",
  FEED_ENHANCEMENT="FEED_ENHANCEMENT",
  UNLIMITED_CONNECTIONS="UNLIMITED_CONNECTIONS",
}

export enum Period{
  DAILY="DAILY",
  WEEKLY="WEEKLY",
  MONTHLY="MONTHLY",
  YEARLY="YEARLY"
}

export enum Trend{
  UP="UP",
  DOWN="DOWN",
  STABLE="STABLE"
}