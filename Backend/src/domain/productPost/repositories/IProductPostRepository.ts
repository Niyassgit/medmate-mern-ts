import { ProductPostListStatus } from "../../../shared/Enums";
import { IMedicalRepWithUser } from "../../medicalRep/entities/IMedicalRepWithUser";
import { IProductPost } from "../entity/IProductPost";
import { IProductPostForFeed } from "../entity/IProductPostForFeed";


export interface IProductPostRepository{
    createPost(userId:string,data:Omit<IProductPost , "id" | "createdAt" | "updatedAt">):Promise<IProductPost |  null>;
    editPost(postId:string,data:Partial<IProductPost>):Promise<IProductPost | null>;
    findPostById(postId:string):Promise<IProductPost | null>;
    getProducts(repId:string,status:ProductPostListStatus):Promise<IProductPostForFeed[] | null>;
    getPostDetails(postId: string): Promise<IProductPost | null>;
    getPostsByIds(repIds:string[],excludedIds:string[]):Promise<IProductPostForFeed[]>;
    archivePost(postId:string):Promise<boolean>;
    unArchive(postId:string):Promise<boolean>;
    DeletePost(postId:string):Promise<boolean>;
    findRepByPostId(postId:string):Promise<IMedicalRepWithUser | null>;
    findPostsByRepId(repId:string):Promise<IProductPostForFeed[] | null>;
    findRepIdByPostId(postId:string):Promise<{repId:string | null}>; 
    countTotalPosts(): Promise<number>;
}
