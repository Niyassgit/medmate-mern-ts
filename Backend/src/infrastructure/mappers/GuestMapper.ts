import { Guest, Prisma, User, Territory } from "@prisma/client";
import { IGuest } from "../../domain/Guest/entities/IGuest";
import { IGuestListItem } from "../../domain/Patient/entities/IGuestListItem";
import { CreateGuestByDoctorDTO } from "../../application/doctor/dto/CreateGuestByDoctorDTO";

export class GuestMapper {
  static toPersistance(
    data: Omit<IGuest, "id" | "createdAt" | "updatedAt">
  ): Prisma.GuestCreateInput {
    return {
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      isRegistered: data.isRegistered,
      ...(data.doctorId ? { doctor: { connect: { id: data.doctorId } } } : {}),
      ...(data.userId ? { user: { connect: { id: data.userId } } } : {}),
      ...(data.territoryId ? { territory: { connect: { id: data.territoryId } } } : {}),
    };
  }

  static toDomain(data: Guest): IGuest {
    return {
      id: data.id,
      name: data.name,
      isRegistered: data.isRegistered,
      email: data.email,
      phone: data.phone ?? "",
      userId: data.loginId ?? null,
      doctorId: data.doctorId,
      territoryId: data.territoryId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static toListItem(guest: Guest & { user?: User | null; territory?: Territory | null }): IGuestListItem {
    if (!guest) {
      console.error("GuestMapper.toListItem - guest is undefined");
      throw new Error("Guest data is undefined");
    }
    if (typeof guest !== 'object') {
      console.error("GuestMapper.toListItem - guest is not an object:", typeof guest, guest);
      throw new Error("Guest data is not an object");
    }
    
    try {
      return {
        id: guest.id,
        name: guest.name,
        email: guest.email ?? null,
        phone: guest.phone ?? null,
        isBlocked: guest.user?.isBlocked ?? null,
        createdAt: guest.createdAt,
        loginId: guest.user?.id ?? null,
        territoryName: guest.territory?.name ?? null,
      };
    } catch (error) {
      console.error("GuestMapper.toListItem - Error accessing guest properties:", error);
      console.error("GuestMapper.toListItem - Guest structure:", {
        hasId: !!guest.id,
        hasName: !!guest.name,
        hasEmail: 'email' in guest,
        emailValue: guest.email,
        guestKeys: Object.keys(guest),
      });
      throw error;
    }
  }

  static toGuestEntityByDoctor(
    dto: CreateGuestByDoctorDTO,
    doctorId: string
  ): Omit<IGuest, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      email: dto.email || null,
      phone: dto.phone || undefined, // Use undefined instead of null to match interface
      userId: null,
      doctorId: doctorId,
      territoryId: dto.territoryId || null,
      isRegistered: false,
    };
  }
}
