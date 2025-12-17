import { IProductPostRepository } from "../../../domain/productPost/repositories/IProductPostRepository";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { ProductListDTO } from "../dto/ProductListDTO";
import { NotFoundError } from "../../errors";
import { ProductPostMapper } from "../mappers/ProductPostMapper";
import { IGetProductPostListUseCase } from "../interfaces/IGetProductPostListUseCase";
import { ErrorMessages} from "../../../shared/Messages";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductPostPresentationService } from "../interfaces/IProductPostPresentationService";
import { ProductPostListStatus } from "../../../shared/Enums";

export class GetProductPostListUseCase implements IGetProductPostListUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _productPostRepository: IProductPostRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _presentationService:IProductPostPresentationService,
    
  ) {}

  async execute(userId: string,status:ProductPostListStatus): Promise<ProductListDTO[] | null> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const repId = await this._medicalRepRepository.findMedicalRepIdByUserId(
      userId
    );
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const products = await this._productPostRepository.getProducts(repId,status);
    if (!products) return null;
    const dto = ProductPostMapper.toProductList(products);
    const mapped=await this._presentationService.mapWithSignedUrls(dto);
    return mapped;
  }
}
