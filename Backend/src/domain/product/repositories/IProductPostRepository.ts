import { IProductPost } from "../entity/IProductPost";


export interface IProductPostRepository{
    createPost(userId:string,data:Omit<IProductPost , "id" | "createdAt" | "updatedAt">):Promise<IProductPost |  null>;
    editPost(postId:string,data:Partial<IProductPost>):Promise<IProductPost | null>;
    getProducts(userId:string):Promise<IProductPost[] | null>;
}