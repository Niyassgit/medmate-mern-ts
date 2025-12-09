import { Patient, Prisma } from "@prisma/client";
import { IPatient } from "../../domain/Patient/entities/IPatient";
import { IPatientRepository } from "../../domain/Patient/repositories/IPatientRepositories";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../config/db";
import { PatientMapper } from "../mappers/PatientMapper";

export class PatientRepository
  extends BaseRepository<
    IPatient,
    Patient,
    Prisma.PatientCreateInput,
    "patient"
  >
  implements IPatientRepository
{
  constructor() {
    super(prisma.patient, (P) => PatientMapper.toDomain(P));
  }

  async createPatient(
    data: Omit<IPatient, "id" | "createdAt" | "updatedAt">
  ): Promise<IPatient> {
    const mappedData = PatientMapper.toPersistance(data);
    return this.create(mappedData);
  }

  async findByEmailId(email: string): Promise<IPatient | null> {
    const result = await prisma.patient.findFirst({ where: { email } });
    if (!result) return null;
    return PatientMapper.toDomain(result);
  }

  async findPatientById(patientId: string): Promise<IPatient | null> {
    return this.findById(patientId);
  }
  async updatePatient(
    patientId: string,
    data: Omit<IPatient, "id" | "createdAt">
  ): Promise<IPatient> {
    const result = await prisma.patient.update({
      where: { id: patientId },
      data,
    });
    return PatientMapper.toDomain(result);
  }
}
