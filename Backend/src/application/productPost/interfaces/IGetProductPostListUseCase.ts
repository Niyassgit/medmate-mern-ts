import { ProductPostListStatus } from "../../../shared/Enums";
import { ProductListDTO } from "../dto/ProductListDTO";

export interface IGetProductPostListUseCase {
  execute(userId: string,status:ProductPostListStatus): Promise<ProductListDTO[] | null>;
}
