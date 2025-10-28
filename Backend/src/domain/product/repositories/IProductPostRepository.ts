import { IProductPost } from "../entity/IProductPost";
import { IProductPostForFeed } from "../entity/IProductPostForFeed";


export interface IProductPostRepository{
    createPost(userId:string,data:Omit<IProductPost , "id" | "createdAt" | "updatedAt">):Promise<IProductPost |  null>;
    editPost(postId:string,data:Partial<IProductPost>):Promise<IProductPost | null>;
    findPostById(postId:string):Promise<IProductPost | null>;
    getProducts(userId:string):Promise<IProductPost[] | null>;
    getPostDetails(postId: string): Promise<IProductPost | null>;
    getPostsByIds(repIds:string[]):Promise<IProductPostForFeed[]>;
}