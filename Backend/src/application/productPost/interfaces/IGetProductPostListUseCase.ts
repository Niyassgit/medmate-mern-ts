import { ProductListDTO } from "../dto/ProductListDTO";

export interface IGetProductPostListUseCase {
  execute(userId: string): Promise<ProductListDTO[] | null>;
}
