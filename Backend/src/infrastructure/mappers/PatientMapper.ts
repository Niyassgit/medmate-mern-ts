import { Patient, Prisma } from "@prisma/client";
import { IPatient } from "../../domain/Patient/entities/IPatient";

export class PatientMapper {
  static toPersistance(
    data: Omit<IPatient, "id" | "createdAt" | "updatedAt">
  ): Prisma.PatientCreateInput {
    return {
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      isRegistered: data.isRegistered,
      ...(data.doctorId ? { doctor: { connect: { id: data.doctorId } } } : {}),
      ...(data.userId ? { user: { connect: { id: data.userId } } } : {}),
    };
  }

  static toDomain(data: Patient): IPatient {
    return {
      id: data.id,
      name: data.name,
      isRegistered: data.isRegistered,
      email: data.email,
      phone: data.phone ?? "",
      userId: data.loginId ?? null,
      doctorId: data.doctorId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
