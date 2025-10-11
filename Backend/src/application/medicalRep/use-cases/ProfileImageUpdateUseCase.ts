import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/messages";
import { BadRequestError, NotFoundError } from "../../errors";
import { IProfileImageUpdateUseCase } from "../interfaces/IProfileImageUpdateUseCase";


export class ProfileImageUpdateUseCase implements IProfileImageUpdateUseCase{
    constructor(
        private _userRepository:IUserRepository
    ){}

    async execute(userId:string,file:Express.Multer.File | null):Promise<string>{
        if(!file) throw new BadRequestError(ErrorMessages.PROFILE_IMAGE_REQUIRED);
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const imageUrl=file.path;
        const res=await this._userRepository.updateProfileImage(userId,imageUrl);
        if(!res) throw new BadRequestError(ErrorMessages.PROFILE_UPDATE_FAIL);
        return SuccessMessages.PROFILE_PIC_UPDATE;
    }
}