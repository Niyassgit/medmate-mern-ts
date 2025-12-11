import { Guest, Prisma, User, Territory } from "@prisma/client";
import { IGuest } from "../../domain/Guest/entities/IGuest";
import { IGuestListItem } from "../../domain/Patient/entities/IGuestListItem";
import { IGuestRepository } from "../../domain/Patient/repositories/IGuestRepositories";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import { GuestMapper } from "../mappers/GuestMapper";

export class GuestRepository
  extends BaseRepository<
    IGuest,
    Guest,
    Prisma.GuestCreateInput,
    "guest"
  >
  implements IGuestRepository
{
  constructor() {
    super(prisma.guest, (G) => GuestMapper.toDomain(G));
  }

  async createGuest(
    data: Omit<IGuest, "id" | "createdAt" | "updatedAt">
  ): Promise<IGuest> {
    const mappedData = GuestMapper.toPersistance(data);
    return this.create(mappedData);
  }

  async findByEmailId(email: string): Promise<IGuest | null> {
    const result = await prisma.guest.findFirst({ where: { email } });
    if (!result) return null;
    return GuestMapper.toDomain(result);
  }

  async findGuestById(guestId: string): Promise<IGuest | null> {
    return this.findById(guestId);
  }
  async updateGuest(
    guestId: string,
    data: Omit<IGuest, "id" | "createdAt">
  ): Promise<IGuest> {
    const result = await prisma.guest.update({
      where: { id: guestId },
      data,
    });
    return GuestMapper.toDomain(result);
  }

  async getAllGuests(
    page: number,
    limit: number,
    search: string,
    territory?: string
  ): Promise<{ guests: IGuestListItem[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.GuestWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (territory) {
      where.territoryId = territory;
    }

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        include: { 
          user: true, 
          territory: true
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.guest.count({ where }),
    ]);
    
    if (!guests || !Array.isArray(guests)) {
      return { guests: [], total: total || 0 };
    }

    const mappedGuests = guests
      .filter((g) => g !== null && g !== undefined && g.id)
      .map((g) => {
        const guestData = {
          ...g,
          user: g.user || null,
          territory: g.territory || null,
        } as Guest & { user?: User | null; territory?: Territory | null };
        
        return GuestMapper.toListItem(guestData);
      });

    return {
      guests: mappedGuests,
      total: total || 0,
    };
  }

  async getGuestsByDoctorId(
    doctorId: string,
    search?: string
  ): Promise<IGuestListItem[]> {
    const where: Prisma.GuestWhereInput = {
      doctorId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const guests = await prisma.guest.findMany({
      where,
      include: {
        user: true,
        territory: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to 50 for search dropdown
    });

    if (!guests || !Array.isArray(guests)) {
      return [];
    }

    return guests
      .filter((g) => g !== null && g !== undefined && g.id)
      .map((g) => {
        const guestData = {
          ...g,
          user: g.user || null,
          territory: g.territory || null,
        } as Guest & { user?: User | null; territory?: Territory | null };
        return GuestMapper.toListItem(guestData);
      });
  }
}
