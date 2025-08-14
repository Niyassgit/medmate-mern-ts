import {prisma} from "../database/prismaClient";
import { IDoctorRepository } from "../../domain/doctor/entities/IDoctorRepository";
import { Doctor } from "../../domain/doctor/entities/Doctor";

export class DoctorRepository implements IDoctorRepository{

    async createDoctor(data: Omit<Doctor, "id" | "updatedAt" | "createdAt">): Promise<Doctor> {
        return prisma.doctor.create({data});
    }

    async getDoctorById(id: string): Promise<Doctor | null> {
        return prisma.doctor.findUnique({where:{id}});
    }

    async getDoctorByEmail(email: string): Promise<Doctor | null> {
        return prisma.doctor.findUnique({where:{email}});
    }
}