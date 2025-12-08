import { IProduct } from "../entities/IProduct";

export interface IProductRepositories{
    getAllProductsByRepId(repId:string):Promise<IProduct[]>;
    createProduct(data:Omit<IProduct,"id"|"createdAt" | "updatedAt">):Promise<IProduct>;
    editProduct(productId:string,data:Omit<IProduct,"id" | "createdAt">):Promise<IProduct>;
    findById(productId:string):Promise<IProduct | null>;
    
}