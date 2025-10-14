import { ProductPostDTO } from "../dto/ProductPostDTO";

export interface IEditProductPostUseCase {
  execute(postId: string, dto: ProductPostDTO): Promise<string>;
}
