import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { NotFoundError } from "../../errors";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";
import { RepDetailsMapper } from "../mapper/RepDetailsMapper";


export class GetRepProfileByIdUseCase{
    constructor(
        private _medicalRepRepository:IMedicalRepRepository
    ){}

    async execute(userId:string):Promise<MedicalRepDetailsDTO | null>{
    const user=await this._medicalRepRepository.getMedicalRepByUserId(userId);
   if(!user) throw new NotFoundError("User not found");
   return RepDetailsMapper.toMedicalRepDetails(user);
    }
}