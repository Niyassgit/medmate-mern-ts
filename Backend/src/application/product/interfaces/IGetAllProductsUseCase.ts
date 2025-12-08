import { ProductDTO } from "../dto/ProdductDTO";

export interface IGetAllProductsUseCase{
    execute(userId?:string):Promise<ProductDTO[]>;
}