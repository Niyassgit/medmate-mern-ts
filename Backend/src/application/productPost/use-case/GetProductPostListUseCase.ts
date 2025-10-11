import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { ProductListDTO } from "../dto/ProductListDTO";
import { NotFoundError } from "../../errors";
import { ProductPostMapper } from "../mappers/ProductPostMapper";
import { IGetProductPostListUseCase } from "../interfaces/IGetProductPostListUseCase";
import {ErrorMessages, SuccessMessages } from "../../../shared/messages";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";

export class GetProductPostListUseCase implements IGetProductPostListUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _productPostRepository: IProductPostRepository,
    private _medicalRepRepository:IMedicalRepRepository
  ) {}

  async execute(userId: string): Promise<ProductListDTO[] | null> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(SuccessMessages.UPLOAD_SUCCESS);
    const repId=await this._medicalRepRepository.findMedicalRepIdByUserId(userId);
    if(!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const products = await this._productPostRepository.getProducts(repId);
    if (!products) return null;
    return ProductPostMapper.toProductList(products);
  }
}
