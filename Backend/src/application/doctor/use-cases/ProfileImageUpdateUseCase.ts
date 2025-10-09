import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { BadRequestError, NotFoundError } from "../../errors";
import { IProfileImageUpdateUseCase } from "../interfaces/IProfileImageUpdateUseCase";

export class ProfileImageUpdateUseCase implements IProfileImageUpdateUseCase {
  constructor(
    private _userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    file: Express.Multer.File | null
  ): Promise<string> {
    if (!file) throw new BadRequestError("No file provided for profile image");
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    const imageUrl = file.path;
    const res = await this._userRepository.updateProfileImage(userId, imageUrl);
    if (!res) throw new BadRequestError("Failed to update profile image");
    return "Profile picture addedd successfully";
  }
}
