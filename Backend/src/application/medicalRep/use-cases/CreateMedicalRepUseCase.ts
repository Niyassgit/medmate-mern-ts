import { IMedicalRepRepository } from "../../../domain/medicalRep/entities/IMedicalRepRepository";
import { RegisterMedicalRepDTO } from "../../../domain/medicalRep/dto/RegisterMedicalRepDTO";
import { BcryptServices } from "../../../infrastructure/security/BcryptService";
import { MedicalRep } from "../../../domain/medicalRep/entities/medicalRep";

export class CreateMedicalRepUseCase{
 
    constructor(private medicalRepRepository:IMedicalRepRepository,private bcryptServices: BcryptServices ){}
    
    async execute(data:RegisterMedicalRepDTO):Promise <MedicalRep>{

      const existingRep=await this.medicalRepRepository.getMedicalRepByEmail(data.email);
      if(existingRep){
        throw new Error(`The user ${data.email} is already exist`);
      }
      const hashedPassword=await this.bcryptServices.hashPassword(data.password);
      return this.medicalRepRepository.createMedicalRep({
           ...data,
          password:hashedPassword,
          subscriptionStatus: "inactive",
          maxConnectionsPerDay: 10
      })
    }
    
}