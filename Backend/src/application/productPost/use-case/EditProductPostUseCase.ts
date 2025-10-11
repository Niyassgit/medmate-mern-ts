import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/messages";
import { BadRequestError, NotFoundError } from "../../errors";
import { ProductPostDTO } from "../dto/ProductPostDTO";
import { IEditProductPostUseCase } from "../interfaces/IEditProductPostUseCase";
import { ProductPostMapper } from "../mappers/ProductPostMapper";


export class EditProductPostUseCase implements IEditProductPostUseCase{


    constructor(
        private _userRepository:IUserRepository,
        private _productPostRepository:IProductPostRepository
    ){}

    async execute(userId:string,dto:ProductPostDTO):Promise<string>{
        if(!dto) throw new BadRequestError(ErrorMessages.FILL_ALL_FILED);
        const rep=await this._userRepository.findById(userId);
        if(!rep) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const formatedData=ProductPostMapper.toProductPostEntity(dto);
        const updated=await this._productPostRepository.editPost(dto.id,formatedData);
        if(!updated) throw new BadRequestError(ErrorMessages.UPLOAD_FAILE);
        return SuccessMessages.UPLOAD_SUCCESS;
    }
}