import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { IArchivePostUseCase } from "../interfaces/IArchivePostUseCase";


export class ArchivePostUseCase implements IArchivePostUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _productPostRepository:IProductPostRepository,
    ){}

  async execute(postId: string, userId?: string): Promise<string> {
    if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
       const user=await this._userRepository.findById(userId);
       if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
       const findPost=await this._productPostRepository.findPostById(postId);
       if(!findPost) throw new BadRequestError(ErrorMessages.POST_NOT_FOUND);
       const isArchived=await this._productPostRepository.archivePost(postId);
       if(!isArchived) return ErrorMessages.OPERATION_FAILE;
       return SuccessMessages.POST_ARCHIVE_SUCCESS;
  }
}