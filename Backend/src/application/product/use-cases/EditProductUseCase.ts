import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductRepositories } from "../../../domain/product/repositories/IProductRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { ProductDTO } from "../dto/ProdductDTO";
import { IEditProductUseCase } from "../interfaces/IEditProductUseCase";
import { ProductMapper } from "../mappers/ProductMapper";

export class EditProductUseCase implements IEditProductUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _productRepository: IProductRepositories,
    private _storageService: IStorageService
  ) {}
  async execute(
    productId: string,
    dto: ProductDTO,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new BadRequestError(ErrorMessages.PRODUCT_NOT_FOUND);
    const product = await this._productRepository.findById(productId);
    if (!product) throw new BadRequestError(ErrorMessages.PRODUCT_NOT_FOUND);
    const oldImages = product.imageUrl || [];
    let newImages = dto.imageUrls || [];

    if (newImages.length === 0 && oldImages.length > 0) {
      newImages = oldImages;
      dto.imageUrls = oldImages;
    }

    const removedImages = oldImages.filter((img) => !newImages.includes(img));

    for (const imgKey of removedImages) {
      try {
        await this._storageService.deleteFile(imgKey);
      } catch {
        // Silently ignore deletion errors - file may already be deleted
      }
    }
    const mappedData = ProductMapper.toEditEntity(dto, repId);
    const result = await this._productRepository.editProduct(
      productId,
      mappedData
    );
    if (!result) throw new BadRequestError(ErrorMessages.OPERATION_FAILE);
    return SuccessMessages.PRODUCT_UPDATED;
  }
}
