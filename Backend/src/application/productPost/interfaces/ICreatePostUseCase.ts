import { ProductPostDTO } from "../dto/ProductPostDTO";

export interface ICreatePostUseCase {
  execute(userId: string, dto: ProductPostDTO): Promise<string>;
}
