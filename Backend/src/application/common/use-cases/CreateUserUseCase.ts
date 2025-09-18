import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { AuthProvider,IUser } from "../../../domain/common/entities/IUserLogin";
import { ConflictError,BadRequestError } from "../../../domain/common/errors";

export class CreateUserUseCase{

    constructor(
        private _userLoginRepository:IUserRepository,
        private _bcryptServices:IBcryptService
    ){}

    async execute(data:Omit<IUser,"id" | "createdAt" | "updatedAt">):Promise<IUser>{

        const existUser=await this._userLoginRepository.findByEmail(data.email);

        if(existUser)   throw new ConflictError("Email already exists");

        if(data.authProvider===AuthProvider.NATIVE && !data.password) {
            throw new BadRequestError("Password is required");
        }
        
        const hashedPassword=data.password ? await this._bcryptServices.hash(data.password):null;
        return this._userLoginRepository.createUser({
            ...data,
            password:hashedPassword
        })
    }
}