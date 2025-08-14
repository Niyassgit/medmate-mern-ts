import { IMedicalRepRepository } from "../../../domain/medicalRep/entities/IMedicalRepRepository";
import { MedicalRep } from "../../../domain/medicalRep/entities/medicalRep";


export class GetMedicalRepByEmailUseCase{
    constructor(private medicalRepRepository:IMedicalRepRepository){}

    async execute(email:string):Promise<MedicalRep>{

      const rep=await this.medicalRepRepository.getMedicalRepByEmail(email);

      if(!rep){
        throw new Error(`Medical rep with email ${email} not found`);
      }
      return rep;
}
}