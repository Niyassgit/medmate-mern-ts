import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { NotFoundError } from "../../errors";
import { UpdateLogoResponseDTO } from "../dto/UpdateLogoResponseDTO";

export class UpdateCompanyLogoUseCase{
    constructor(
        private _medicalRepRepository:IMedicalRepRepository
    ){}

    async execute(id:string,file:Express.Multer.File | null):Promise<UpdateLogoResponseDTO>{
        if(!file) throw new NotFoundError("Company Logo not found for update");
        const user=await this._medicalRepRepository.getMedicalRepById(id);
        if(!user) throw new NotFoundError("User not found");
            console.log("companyu logo url:",file.filename);
         const logoUrl = `/uploads/company-logo/${file.filename}`;  
        const url=await this._medicalRepRepository.updateCompanyLogo(id,logoUrl);
       return {
        message:"Company Logo updated successfully",
        LogoUrl:url
       };
    }
}