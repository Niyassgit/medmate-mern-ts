import { ISuperAdminRepository } from "../../domain/superAdmin/repositories/ISuperAdminRepository";
import { ISuperAdmin } from "../../domain/superAdmin/entities/ISuperAdmin";
import { prisma } from "../database/prisma";

export class SuperAdminRepository implements ISuperAdminRepository {
  async createSuperAdmin(
    data: Omit<ISuperAdmin, "id" | "createdAt" | "updatedAt">
  ): Promise<ISuperAdmin> {
    const created = await prisma.superAdmin.create({
      data: {
        ...data,
      },
    });
    return created;
  }

  async getSuperAdminByEmail(email: string): Promise<ISuperAdmin | null> {
    const userLogin = await prisma.user.findUnique({
      where: { email },
      include: { superAdmin: true },
    });

    if (!userLogin || !userLogin.superAdmin) return null;

    const admin = userLogin.superAdmin;

    return {
      id: admin.id,
      loginId: admin.loginId,
      name: admin.name,
      phone: admin.phone,
    };
  }
}
