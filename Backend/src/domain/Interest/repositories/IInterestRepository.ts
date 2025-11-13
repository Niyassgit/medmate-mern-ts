import { IInterest } from "../entities/IInterest";

export interface IInterestRepository{
    toggleInterest(postId:string,doctorId:string):Promise<{interested:boolean,interest?:IInterest}>;
    getInterestCount(postId:string):Promise<number>;
    getProductIdsByDoctorId(doctorId:string):Promise<string[]>;
}