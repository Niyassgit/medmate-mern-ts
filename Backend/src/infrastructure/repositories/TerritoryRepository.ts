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
  async findAllTerritories(): Promise<ITerritory[] | null> {
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
  async createTerritory(data: CreateTerritoryDTO): Promise<ITerritory | null> {
    const formatted=TerritoryMapper.toPersistance(data);
    const response=await this.create(formatted);
    return response?response:null;

  }
  async updateTerritory(territoryId: string, data: CreateTerritoryDTO): Promise<ITerritory | null> {
     const response=await this.update(territoryId,data);
     return response;
  }

}
