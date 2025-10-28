import { IStorageService } from "../../../domain/common/services/IStorageService";
import { ProductListDTO } from "../../productPost/dto/ProductListDTO";
import { IProductPostPresentationService } from "../../productPost/interfaces/IProductPostPresentationService";

export class ProductPostPresentationService implements IProductPostPresentationService{
  constructor(private _storageService: IStorageService) {}

  async mapWithSignedUrls(dto: ProductListDTO[]): Promise<ProductListDTO[]> {
    return Promise.all(
      dto.map(async (post) => {
        const signedUrl = post.image
          ? await this._storageService.generateSignedUrl(post.image)
          : "";
        return {
          ...post,
          image: signedUrl,
        };
      })
    );
  }

}
