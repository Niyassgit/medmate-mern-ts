import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { BadRequestError, NotFoundError } from "../../errors";
import { ProductPostDTO } from "../dto/ProductPostDTO";
import { ProductPostMapper } from "../mappers/ProductPostMapper";

export class CreatePostUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _productpostRepository:IProductPostRepository
      
    ){}
    async execute(userId:string,dto:ProductPostDTO):Promise<string>{
        if(!dto)throw new BadRequestError("Fill all the fields to continue posting");
        const rep=await this._userRepository.findById(userId);
        if(!rep) throw new NotFoundError("You must complete your profile to continue posting...");
       
        const formatedData=ProductPostMapper.toProductPostEntity(dto);
        console.log('data before passsing to create post:',formatedData);
        const creatPost=await this._productpostRepository.createPost(rep.id,formatedData);
        if(!creatPost) throw new BadRequestError("Post upload failed");
        return "Post uploaded successfully";

    }
}