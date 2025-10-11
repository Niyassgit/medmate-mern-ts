import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { BadRequestError, NotFoundError } from "../../errors";
import { ProductPostDTO } from "../dto/ProductPostDTO";
import { ICreatePostUseCase } from "../interfaces/ICreatePostUseCase";
import { ProductPostMapper } from "../mappers/ProductPostMapper";
import { ErrorMessages, SuccessMessages } from "../../../shared/messages";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
export class CreatePostUseCase implements ICreatePostUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _productpostRepository: IProductPostRepository,
    private _medicalRepRepositoy: IMedicalRepRepository
  ) {}
  async execute(userId: string, dto: ProductPostDTO): Promise<string> {
    if (!dto) throw new BadRequestError(ErrorMessages.FILL_ALL_FILED);
    const rep = await this._userRepository.findById(userId);
    if (!rep) throw new NotFoundError(ErrorMessages.COMPLETE_PROFILE_ERROR);

    const medicalRepId =
      await this._medicalRepRepositoy.findMedicalRepIdByUserId(userId);
    if (!medicalRepId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const formatedData = ProductPostMapper.toProductPostEntity(dto);
    const creatPost = await this._productpostRepository.createPost(
      medicalRepId,
      formatedData
    );
    if (!creatPost) throw new BadRequestError(ErrorMessages.UPLOAD_FAILE);
    return SuccessMessages.UPLOAD_SUCCESS;
  }
}
