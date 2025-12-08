import { NotFoundError } from "../../../domain/common/errors";
import { IProductPostRepository } from "../../../domain/productPost/repositories/IProductPostRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { PostDetailsDTO } from "../dto/PostDetailsDTO";
import { IGetProductPostDetailsUseCase } from "../interfaces/IPostDetailsUseCase";
import { ProductPostMapper } from "../mappers/ProductPostMapper";

export class GetProductPostDetailsUseCase
  implements IGetProductPostDetailsUseCase
{
  constructor(
    private _productPostRepository: IProductPostRepository,
    private _storageService: IStorageService
  ) {}
  async execute(postId: string): Promise<PostDetailsDTO> {
    const post = await this._productPostRepository.getPostDetails(postId);
    if (!post) throw new NotFoundError(ErrorMessages.RETRY_LATER);
    const postDto = ProductPostMapper.toDomain(post,this._storageService);
    return postDto;
  }
}