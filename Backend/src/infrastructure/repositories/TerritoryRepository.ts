import { Prisma, Territory } from "@prisma/client";
import { ITerritory } from "../../domain/territory/entity/ITerritories";
import { ITerritoryRepository } from "../../domain/territory/ITerritoryRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../config/db";
import { CreateTerritoryDTO } from "../../application/superAdmin/dto/CreateTerritoryDTO";
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
  async findAllTerritories(page: number, limit: number, search: string): Promise<{ territories: ITerritory[]; total: number; }> {
    const skip=(page-1)*limit;
    const where:Prisma.TerritoryWhereInput=search?{
      OR:[
        {name:{contains:search,mode:"insensitive"}}
      ]
    }:{}
    const [territories,total]=await Promise.all([
      prisma.territory.findMany({
        where,
        orderBy:{createdAt:"desc"},
        skip,
        take:limit
      }),
      prisma.territory.count({where})
    ]);

    return{
      territories:TerritoryMapper.toListTerritories(territories),
      total
    }

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
  async getAllTerritories(): Promise<ITerritory[]> {
    return this.findAll();
  }
  async getTerritoryName(terrId: string): Promise<string |null> {
    const territory=await prisma.territory.findFirst({
      where:{id:terrId},
      select:{name:true},
    });
    return territory?.name ?? null;
  }
}
