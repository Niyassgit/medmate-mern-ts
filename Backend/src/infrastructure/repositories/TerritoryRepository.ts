import { Prisma, Territory } from "@prisma/client";
import { ITerritory } from "../../domain/territory/entity/ITerritories";
import { ITerritoryRepository } from "../../domain/territory/ITerritoryRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../../config/db";
import { CreateTerritoryDTO } from "../../application/territory/dto/CreateTerritoryDTO";
import { TerritoryMapper } from "../mappers/TerritoryMapper";

export class TerritoryRepository
  extends BaseRepository<
    ITerritory,
    Territory,
    Prisma.TerritoryCreateInput,
    "territory"
  >
  implements ITerritoryRepository
{

    constructor(){
        super(prisma.territory,(territory)=>TerritoryMapper.toDomain(territory))
    }
  async findAllTerritories(userId: string): Promise<ITerritory[] | null> {
    const territories = await prisma.territory.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        doctors: {
          select: { id: true, name: true },
        },
        repTerritories: {
          select: {
            repId: true,
            rep: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
    return territories.length >0 ? territories : null;
  }
  async createTerritory(dto: CreateTerritoryDTO): Promise<ITerritory | null> {
    const formatted=TerritoryMapper.toPersistance(dto);
    if(!formatted) return null;
      const territory=await prisma.territory.create({
        data:formatted
      });
      return territory? territory :null;
  }
}
