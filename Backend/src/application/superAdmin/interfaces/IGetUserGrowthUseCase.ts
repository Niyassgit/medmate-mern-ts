import { UserGrowthDTO } from "../dto/UserGrowthDTO";

export interface IGetUserGrowthUseCase {
  execute(userId?: string, year?: string): Promise<UserGrowthDTO>;
}

