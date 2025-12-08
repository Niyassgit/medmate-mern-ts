import { ProductDTO } from "../dto/ProdductDTO";

export interface ICreateProductUseCase {
  execute(userId: string, dto: ProductDTO): Promise<string>;
}

