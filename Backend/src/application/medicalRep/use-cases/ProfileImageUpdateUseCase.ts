import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { BadRequestError, NotFoundError } from "../../errors";


export class ProfileImageUpdateUseCase{
    constructor(
        private _medicalRepRepository:IMedicalRepRepository
    ){}

    async execute(userId:string,file:Express.Multer.File | null):Promise<string>{
        if(!file) throw new BadRequestError("No file provided for profile image");
        const user=await this._medicalRepRepository.getMedicalRepById(userId);
        if(!user) throw new NotFoundError("User not found");
        const imageUrl=file.path;
        await this._medicalRepRepository.updateProfileImage(userId,imageUrl);
        return "Profile picture added Successfully"
    }
}