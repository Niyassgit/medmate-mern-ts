import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, NotFoundError } from "../../errors";
import { ProductPostDTO } from "../dto/ProductPostDTO";
import { IEditProductPostUseCase } from "../interfaces/IEditProductPostUseCase";
import { ProductPostMapper } from "../mappers/ProductPostMapper";

export class EditProductPostUseCase implements IEditProductPostUseCase {
  constructor(private _productPostRepository: IProductPostRepository) {}

  async execute(postId: string, dto: ProductPostDTO): Promise<string> {
    const post = await this._productPostRepository.findPostById(postId);
    if (!post) throw new NotFoundError(ErrorMessages.POST_NOT_FOUND);
    const formatedData = ProductPostMapper.toProductPostEntity(dto);
    const updated = await this._productPostRepository.editPost(
      postId,
      formatedData
    );
    if (!updated) throw new BadRequestError(ErrorMessages.UPLOAD_FAILE);
    return SuccessMessages.POST_UPDATE_SUCCESS;
  }
}
