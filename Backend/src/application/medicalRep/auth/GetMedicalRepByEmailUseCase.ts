import { IMedicalRepRepository } from "../../../domain/medicalRep/entities/IMedicalRepRepository"; 
import { MedicalRep } from "../../../domain/medicalRep/entities/MedicalRep";


export class GetMedicalRepByEmailUseCase{
    constructor(private _medicalRepRepository:IMedicalRepRepository){}

    async execute(email:string):Promise<MedicalRep>{

      const rep=await this._medicalRepRepository.getMedicalRepByEmail(email);

      if(!rep){
        throw new Error(`Medical rep with email ${email} not found`);
      }
      return rep;
}
}