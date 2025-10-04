import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { BadRequestError, NotFoundError } from "../../errors";
import { ProductPostDTO } from "../dto/ProductPostDTO";
import { ProductPostMapper } from "../mappers/ProductPostMapper";

export class CreatePostUseCase{
    constructor(
        private _medicalRepRepository:IMedicalRepRepository,
        private _productpostRepository:IProductPostRepository
      
    ){}
    async execute(userId:string,data:ProductPostDTO):Promise<string>{

        const rep=await this._medicalRepRepository.getMedicalRepByUserId(userId);
        if(!rep) throw new NotFoundError("You must complete your profile to continue posting...");
        const formatedData=ProductPostMapper.toProductPostEntity(data);
        const creatPost=await this._productpostRepository.createPost(rep.id,formatedData);
        if(!creatPost) throw new BadRequestError("Post upload failed");
        return "Product uploaded successfully";

    }
}