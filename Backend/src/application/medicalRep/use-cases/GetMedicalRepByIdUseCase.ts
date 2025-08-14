import { IMedicalRepRepository } from "../../../domain/medicalRep/entities/IMedicalRepRepository";
import { MedicalRep } from "../../../domain/medicalRep/entities/medicalRep";



export class GetMedicalRepByIdUseCase{
    constructor(private medicalRepRepository:IMedicalRepRepository){}

    async execute(id:string):Promise<MedicalRep>{
        const rep= await this.medicalRepRepository.getMedicalRepById(id);

        if(!rep){
            throw new Error(`MeedicalRep with id ${id} not found`);
        }
        return rep;
    }
    
}