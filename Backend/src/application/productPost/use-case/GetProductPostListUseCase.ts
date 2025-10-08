import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { ProductListDTO } from "../dto/ProductListDTO";
import { NotFoundError } from "../../errors";
import { ProductPostMapper } from "../mappers/ProductPostMapper";


export class GetProductPostListUseCase{
   constructor(
    private _userRepository:IUserRepository,
    private _productPostRepository:IProductPostRepository
   ){}

   async execute(userId:string):Promise<ProductListDTO[] | null>{
    const user=await this._userRepository.findById(userId);
    if(!user) throw new NotFoundError("User not found");
    const products=await this._productPostRepository.getProducts(userId);
    if(!products) return null;
    return ProductPostMapper.toProductList(products);
   }
}