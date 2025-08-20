import { IUserLoginRepository } from "../../domain/common/entities/IUserLoginRepository";
import { BcryptServices } from "../../infrastructure/security/BcryptService";
import { AuthProvider,Role,UserLogin } from "../../domain/common/entities/UserLogin";


export class CreateUserLoginUseCase{

    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _bcryptServices:BcryptServices
    ){}

    async execute(data:Omit<UserLogin,"id" | "createdAt" | "updatedAt">):Promise<UserLogin>{

        const existUser=await this._userLoginRepository.findByEmail(data.email);

        if(existUser) throw new Error(`User with ${data.email} already exists`);

        if(data.authProvider===AuthProvider.NATIVE && !data.password) {
            throw new Error("Password is required for NATIVE signup");
        }
        
        const hashedPassword=data.password ? await this._bcryptServices.hashPassword(data.password):null;
        return this._userLoginRepository.createUserLogin({
            ...data,
            password:hashedPassword
        })
    }
}