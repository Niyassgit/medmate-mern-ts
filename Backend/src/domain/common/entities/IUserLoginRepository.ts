import { UserLogin } from "./UserLogin";



export interface IUserLoginRepository{

    createUserLogin(data:Omit<UserLogin , "id" | "createdAt" | "updatedAt">):Promise <UserLogin>;
    findByEmail(email:string): Promise<UserLogin | null>;
} 