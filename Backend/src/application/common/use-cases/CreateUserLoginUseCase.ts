import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { AuthProvider,IUserLogin } from "../../../domain/common/entities/IUserLogin";
import { ConflictError,BadRequestError } from "../../../domain/common/errors";

export class CreateUserLoginUseCase{

    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _bcryptServices:IBcryptService
    ){}

    async execute(data:Omit<IUserLogin,"id" | "createdAt" | "updatedAt">):Promise<IUserLogin>{

        const existUser=await this._userLoginRepository.findByEmail(data.email);

        if(existUser)   throw new ConflictError("Email already exists");

        if(data.authProvider===AuthProvider.NATIVE && !data.password) {
            throw new BadRequestError("Password is required");
        }
        
        const hashedPassword=data.password ? await this._bcryptServices.hash(data.password):null;
        return this._userLoginRepository.createUserLogin({
            ...data,
            password:hashedPassword
        })
    }
}