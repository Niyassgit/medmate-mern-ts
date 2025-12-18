import { Prisma, Territory } from "@prisma/client";
import { ITerritory } from "../../domain/territory/entity/ITerritories";
import { ITerritoryUsersMinimal } from "../../domain/territory/entity/ITerritoryUsersMinimal";
import { Role } from "../../shared/Enums";
import { TerritoryUsersPrismaResult } from "../types/TerritoryUserPrismaResult";

export class TerritoryMapper {
  static toPersistance(
    entitiy: Omit<ITerritory, "id" | "createdAt" | "updatedAt">
  ): Prisma.TerritoryCreateInput {
    return {
      name: entitiy.name,
      region: entitiy.region,
    };
  }
  static toDomain(territory: Territory): ITerritory {
    return {
      id: territory.id,
      name: territory.name,
      region: territory.region,
      createdAt: territory.createdAt,
      updatedAt: territory.updatedAt,
    };
  }
  static toListTerritories(persistane: Territory[]): ITerritory[] {
    return persistane.map((ter) => ({
      id: ter.id,
      name: ter.name,
      region: ter.region,
      createdAt: ter.createdAt,
      updatedAt: ter.updatedAt,
    }));
  }

  static toTerritoryUserToDomain(
    data: TerritoryUsersPrismaResult
  ): ITerritoryUsersMinimal {
    return {
      territoryId: data.id,
      users: [
        ...data.doctors.map((doctor) => ({
          id: doctor.id,
          name: doctor.name,
          phone: doctor.phone,
          role: Role.DOCTOR,
          department: doctor.department?.name,
        })),

        ...data.repTerritories
          .filter((rt) => rt.rep)
          .map(({ rep }) => ({
            id: rep!.id,
            name: rep!.name,
            phone: rep!.phone,
            role: Role.MEDICAL_REP,
            department: rep!.department?.name,
          })),

        ...data.guests.map((guest) => ({
          id: guest.id,
          name: guest.name,
          phone: guest.phone ?? undefined,
          role: Role.GUEST,
        })),
      ],
    };
  }
}
