import { TerritoriesDTO } from "../dto/TerritoriesDTO";

export interface IGetTerritoriesUseCase{
    execute(userId:string):Promise<TerritoriesDTO[] | null>
}