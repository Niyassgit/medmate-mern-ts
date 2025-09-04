import { IUserLoginRepository } from "../../domain/common/repositories/IUserLoginRepository";
import { BcryptServices } from "../../infrastructure/services/BcryptService";
import { AuthProvider,IUserLogin } from "../../domain/common/entities/IUserLogin";
import { ConflictError,BadRequestError } from "../../domain/common/errors";

export class CreateUserLoginUseCase{

    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _bcryptServices:BcryptServices
    ){}

    async execute(data:Omit<IUserLogin,"id" | "createdAt" | "updatedAt">):Promise<IUserLogin>{

        const existUser=await this._userLoginRepository.findByEmail(data.email);

        if(existUser)   throw new ConflictError("Email already exists");

        if(data.authProvider===AuthProvider.NATIVE && !data.password) {
            throw new BadRequestError("Password is required");
        }
        
        const hashedPassword=data.password ? await this._bcryptServices.hashPassword(data.password):null;
        return this._userLoginRepository.createUserLogin({
            ...data,
            password:hashedPassword
        })
    }
}