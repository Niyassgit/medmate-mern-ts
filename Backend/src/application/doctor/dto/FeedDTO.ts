export interface FeedDTO{
    id:string;
    title:string;
    image:string | null;
    useCases:string[];
    createdAt:Date;
    likes:number;
    interests:number;
    rep:{
        id:string;
        name:string;
        company:string;
        ProfileImage?:string | null;
    }
}