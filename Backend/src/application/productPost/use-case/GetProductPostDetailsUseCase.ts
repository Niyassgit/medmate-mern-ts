import { NotFoundError } from "../../../domain/common/errors";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { ErrorMessages } from "../../../shared/messages";
import { PostDetailsDTO } from "../dto/PostDetailsDTO";
import { IGetProductPostDetailsUseCase } from "../interfaces/IPostDetailsUseCase";
import { ProductPostMapper } from "../mappers/ProductPostMapper";



export class GetProductPostDetailsUseCase implements IGetProductPostDetailsUseCase{
    constructor(
        private _productPostRepository:IProductPostRepository,
    ){}
    async execute(postId: string): Promise<PostDetailsDTO> {
        const post=await this._productPostRepository.getPostDetails(postId);
        if(!post) throw new NotFoundError(ErrorMessages.RETRY_LATER);
        return ProductPostMapper.toDomain(post);
    }
}