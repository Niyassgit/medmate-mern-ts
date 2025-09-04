import { IUserLogin } from "../entities/IUserLogin";



export interface IUserLoginRepository{

    createUserLogin(data:Omit<IUserLogin , "id" | "createdAt" | "updatedAt">):Promise <IUserLogin>;
    findByEmail(email:string): Promise<IUserLogin | null>;
    updateBlockStatus(userId:string,isBlocked:boolean):Promise<IUserLogin | null>;
    
} 