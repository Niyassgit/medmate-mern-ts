import { IUserLogin,Role,AuthProvider } from "./IUserLogin";

export class UserLogin implements IUserLogin{
    constructor(
            public id:string,
            public email:string,
            public authProvider:AuthProvider | null,
            public role:Role,
            public createdAt:Date,
            public updatedAt:Date,
            public password?:string | null,
            public providerId?:string | null,
    ){}
}