import { IUserValidationService } from "../../../domain/common/services/IUserValidationService";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { UnautharizedError } from "../../../domain/common/errors";
import { ErrorMessages } from "../../../shared/Messages";
import { ForbiddenError, NotFoundError } from "../../errors";



export class UserValidationService implements IUserValidationService{
    constructor(private _userRepository:IUserRepository){}

    async validateUser(userId: string): Promise<void> {
        if(!userId ) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        if(user.isBlocked) throw new ForbiddenError(ErrorMessages.USER_BLOCKED);
        if(!user.isVerified) throw new UnautharizedError(ErrorMessages.USER_NOT_VERIFIED);
    }
}