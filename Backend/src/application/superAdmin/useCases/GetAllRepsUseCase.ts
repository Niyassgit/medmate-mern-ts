import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { RepListDTO } from "../dto/RepListDTO";
import { RepListMapper } from "../mappers/RepListMapper";

export class GetAllRepsUseCase{
    constructor(
        private _medicalRepRepository:IMedicalRepRepository
    ){}

    async execute():Promise<RepListDTO[]>{
        const reps=await this._medicalRepRepository.getAllMedicalReps();
        return reps.map((rep)=>RepListMapper.toRepListDTO(rep));
    }
}