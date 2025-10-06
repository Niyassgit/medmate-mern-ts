import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { BadRequestError, NotFoundError } from "../../errors";
import { ProductPostDTO } from "../dto/ProductPostDTO";
import { ProductPostMapper } from "../mappers/ProductPostMapper";


export class EditProductPostUseCase{


    constructor(
        private _medcialRepRepositiory:IMedicalRepRepository,
        private _productPostRepository:IProductPostRepository
    ){}

    async execute(userId:string,dto:ProductPostDTO):Promise<string>{
        if(!dto) throw new BadRequestError("Fill the missing field and continue...");
        const rep=await this._medcialRepRepositiory.getMedicalRepByUserId(userId);
        if(!rep) throw new NotFoundError("User not found");
        const formatedData=ProductPostMapper.toProductPostEntity(dto);
        const updated=await this._productPostRepository.editPost(dto.id,formatedData);
        if(!updated) throw new BadRequestError("Edit post Failed");
        return "Post updated successfully";
    }
}