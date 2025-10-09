import { ProductPostDTO } from "../dto/ProductPostDTO";

export interface IEditProductPostUseCase {
  execute(userId: string, dto: ProductPostDTO): Promise<string>;
}
