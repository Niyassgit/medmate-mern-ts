export interface IEngagementEventPublisher{
   publishLikeToggled(event:{
    productId:string;
    doctorId:string;
    liked:boolean;
    totalLikes:number;
   }):Promise<void>;
}