import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductRepositories } from "../../../domain/product/repositories/IProductRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { ProductDTO } from "../dto/ProdductDTO";
import { ICreateProductUseCase } from "../interfaces/ICreateProductUseCase";
import { ProductMapper } from "../mappers/ProductMapper";

export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _productRepository: IProductRepositories
  ) {}

  async execute(userId: string, dto: ProductDTO): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    if (!dto) throw new BadRequestError(ErrorMessages.FILL_ALL_FILED);

    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const productData = ProductMapper.toEntity(dto, repId);
    const createdProduct = await this._productRepository.createProduct(
      productData
    );

    if (!createdProduct) throw new BadRequestError(ErrorMessages.UPLOAD_FAILE);

    return SuccessMessages.UPLOAD_SUCCESS;
  }
}
