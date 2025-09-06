import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { RepListDTO } from "../dto/RepListDTO";
import { RepListMapper } from "../mappers/RepListMapper";

export class GetAllRepsUseCase{
    constructor(
        private _medicalRepRepository:IMedicalRepRepository
    ){}

    async execute(page:number,limit:number):Promise<RepListDTO[]>{
        const medicalRep=await this._medicalRepRepository.getAllMedicalReps(page,limit);
        return medicalRep.reps.map((rep)=>RepListMapper.toRepListDTO(rep));
    }
}