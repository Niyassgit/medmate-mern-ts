import { ICloudinaryService } from "../../../domain/common/services/ICloudinaryService";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { BadRequestError, NotFoundError } from "../../errors";



export class ProfileImageUpdateUseCase{
    constructor(
        private _cloudinaryService:ICloudinaryService,
        private _userRepository:UserRepository,
        private _doctorRepository:IDoctorRepository
    ){}

    async execute(userId:string,file:Express.Multer.File | null):Promise<string>{
        if(!file) throw new BadRequestError("No file provided for profile image");
        const  user=await this._doctorRepository.getDoctorById(userId);
        if(!user) throw new NotFoundError("User not found");
        const imageUrl=file.path;
        await this._doctorRepository.updateProfileImage(userId,imageUrl);

        return "Profile picture addedd successfully"
    }
}