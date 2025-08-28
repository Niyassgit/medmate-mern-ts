import { IMedicalRepRepository } from "../../../domain/medicalRep/entities/IMedicalRepRepository";
import { IMedicalRep } from "../../../domain/medicalRep/entities/IMedicalRep";
import { UnautharizedError } from "../../../domain/common/errors";


export class GetMedicalRepByIdUseCase{
    constructor(private _medicalRepRepository:IMedicalRepRepository){}

    async execute(id:string):Promise<IMedicalRep>{
        const rep= await this._medicalRepRepository.getMedicalRepById(id);

        if(!rep){
            throw new UnautharizedError(`MeedicalRep with id ${id} not found`);
        }
        return rep;
    }
    
}