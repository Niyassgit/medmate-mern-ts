import { ProductListDTO } from "../dto/ProductListDTO";

export interface IProductPostPresentationService {
  mapWithSignedUrls(dto: ProductListDTO[]): Promise<ProductListDTO[]>;
//    mapPostWithSignedUrls(dto: ProductListDTO): Promise<ProductListDTO>;
}
