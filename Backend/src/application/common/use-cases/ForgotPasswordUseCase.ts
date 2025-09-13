import { IUserLogin } from "../../../domain/common/entities/IUserLogin";
import { NotFoundError } from "../../../domain/common/errors";
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { BcryptServices } from "../../../infrastructure/services/BcryptService";

export class ForgotPasswordUseCase{
    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _bcryptService:BcryptServices
    ){}

    async execute(email:string,newPassword:string):Promise<IUserLogin>{
       
        const user=await this._userLoginRepository.findByEmail(email);
        if(!user) throw new NotFoundError("User not found");

        const hashedNewPassword=await this._bcryptService.hashValue(newPassword);

        return this._userLoginRepository.resetPassword(user.id,hashedNewPassword);
      
    }
}