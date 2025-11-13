import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, NotFoundError, UnautharizedError } from "../../errors";
import { IDeletePostUseCase } from "../interfaces/IDeletePostUseCase";

export class DeletePostUseCase implements IDeletePostUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _productPostRepository:IProductPostRepository
    ){}
    async execute(postId: string, userId?: string): Promise<string> {
        if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        const user= await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const postExists=await this._productPostRepository.findPostById(postId);
        if(!postExists) throw new BadRequestError(ErrorMessages.POST_NOT_FOUND);
        const isDeleted=await this._productPostRepository.DeletePostUseCase(postId);
        if(!isDeleted) return ErrorMessages.OPERATION_FAILE;
        return SuccessMessages.POST_DELETE_SUCCESS;

    }
}