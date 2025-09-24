import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { NotFoundError } from "../../errors";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";
import { UserDetailsMapper } from "../mappers/UserDetailsMapper";


export class GetMedicalRepDetailsUseCase{
    constructor(
        private _medicalRepRepository:IMedicalRepRepository
    ){}

    async execute(userId:string):Promise<MedicalRepDetailsDTO | null>{

        const user=await this._medicalRepRepository.getMedicalRepById(userId);
        if(!user) throw new NotFoundError("User not found");
        return UserDetailsMapper.toMedicalRepDetails(user);
    }
}