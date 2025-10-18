import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { BadRequestError, NotFoundError } from "../../errors";
import { IProfileImageUpdateUseCase } from "../interfaces/IProfileImageUpdateUseCase";

export class ProfileImageUpdateUseCase implements IProfileImageUpdateUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _storageService: IStorageService
  ) {}

  async execute(
    userId: string,
    fileKey?: string | null
  ): Promise<{ message: string; signedUrl: string }> {
    if (!fileKey)
      throw new BadRequestError(ErrorMessages.PROFILE_IMAGE_REQUIRED);
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const oldFileKey = user.profileImage;
    const res = await this._userRepository.updateProfileImage(userId, fileKey);
    if (!res) throw new BadRequestError(ErrorMessages.UPLOAD_FAILE);
    if (oldFileKey && oldFileKey !== fileKey) {
      await this._storageService.deleteFile(oldFileKey);
    }
    const signedUrl = await this._storageService.generateSignedUrl(fileKey);
    return { message: SuccessMessages.PROFILE_PIC_UPDATE, signedUrl };
  }
}
