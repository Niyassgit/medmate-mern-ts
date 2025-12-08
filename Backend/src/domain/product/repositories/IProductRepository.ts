import { IProduct } from "../entities/IProduct";

export interface IProductRepositories{
    getAllProductsByRepId(repId:string):Promise<IProduct[]>;
    createProduct(data:Omit<IProduct,"id"|"createdAt" | "updatedAt">):Promise<IProduct>;
    
}