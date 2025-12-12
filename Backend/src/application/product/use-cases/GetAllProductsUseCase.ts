import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductRepositories } from "../../../domain/product/repositories/IProductRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ProductDTO } from "../dto/ProdductDTO";
import { IGetAllProductsUseCase } from "../interfaces/IGetAllProductsUseCase";
import { ProductMapper } from "../mappers/ProductMapper";

export class GetAllProductsUseCase implements IGetAllProductsUseCase {
  constructor(
    private _medicalRepRepositry: IMedicalRepRepository,
    private _productRepository: IProductRepositories,
    private _sotrageService: IStorageService
  ) {}
  async execute(userId?: string): Promise<ProductDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repId } = await this._medicalRepRepositry.getRepIdByUserId(userId);
    if (!repId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const products = await this._productRepository.getAllProductsByRepId(repId);
    return Promise.all(
      products.map((data) => ProductMapper.toDomain(data, this._sotrageService))
    );
  }
}
