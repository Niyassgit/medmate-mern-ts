import { ProductPostListStatus } from "../../../shared/Enums";
import { ProductListDTO } from "../dto/ProductListDTO";

export interface IGetProductPostListUseCase {
  execute(
    userId: string,
    status: ProductPostListStatus,
    page: number,
    limit: number
  ): Promise<{ data: ProductListDTO[]; total: number } | null>;
}
