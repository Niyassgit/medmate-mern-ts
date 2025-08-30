import { IUserLogin } from "./IUserLogin";



export interface IUserLoginRepository{

    createUserLogin(data:Omit<IUserLogin , "id" | "createdAt" | "updatedAt">):Promise <IUserLogin>;
    findByEmail(email:string): Promise<IUserLogin | null>;
    
} 