import { ProductDTO } from "../dto/ProdductDTO";

export interface IEditProductUseCase {
  execute(productId: string, dto: ProductDTO, userId?: string): Promise<string>;
}
