import { IMedicalRepRepository } from "../../../domain/medicalRep/entities/IMedicalRepRepository";
import { MedicalRep } from "../../../domain/medicalRep/entities/MedicalRep";



export class GetMedicalRepByIdUseCase{
    constructor(private _medicalRepRepository:IMedicalRepRepository){}

    async execute(id:string):Promise<MedicalRep>{
        const rep= await this._medicalRepRepository.getMedicalRepById(id);

        if(!rep){
            throw new Error(`MeedicalRep with id ${id} not found`);
        }
        return rep;
    }
    
}