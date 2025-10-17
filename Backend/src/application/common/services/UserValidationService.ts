import { IUserValidationService } from "../../../domain/common/services/IUserValidationService";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { UnautharizedError } from "../../../domain/common/errors";
import { ErrorMessages } from "../../../shared/Messages";



export class UserValidationService implements IUserValidationService{
    constructor(private _userRepository:IUserRepository){}

    async validateUser(userId: string): Promise<void> {
        if(!userId ) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

        const user=await this._userRepository.findById(userId);
        if(!user || !user?.isVerified || user.isBlocked) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    }
}