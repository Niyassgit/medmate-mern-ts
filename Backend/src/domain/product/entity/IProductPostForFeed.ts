import { IProductPost } from "./IProductPost";

export interface IProductPostForFeed extends IProductPost{
    rep:{
        id:string;
        name:string;
        company:string;
        image?:string | null;
    }
    _count:{
        likes?:number;
        isInterested?:number;
    }
}