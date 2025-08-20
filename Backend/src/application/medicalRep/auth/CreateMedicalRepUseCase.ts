import { IMedicalRepRepository } from "../../../domain/medicalRep/entities/IMedicalRepRepository"; 
import { BcryptServices } from "../../../infrastructure/security/BcryptService";  
import { MedicalRep } from "../../../domain/medicalRep/entities/MedicalRep";  
import { IUserLoginRepository } from "../../../domain/common/entities/IUserLoginRepository"; 
import { AuthProvider,Role } from "../../../domain/common/entities/UserLogin"; 
import { RegisterMedicalRepDTO } from "../../../domain/medicalRep/dto/RegisterMedicalRepDTO"; 


export class CreateMedicalRepUseCase{
 
    constructor(private _medicalRepRepository:IMedicalRepRepository,
      private _bcryptServices: BcryptServices, 
      private _userLoginRepository:IUserLoginRepository
    
    ){}
    
    async execute(data:RegisterMedicalRepDTO):Promise <MedicalRep>{

      const existingRep=await this._medicalRepRepository.getMedicalRepByEmail(data.email);
      if(existingRep){
        throw new Error(`The user ${data.email} is already exist`);
      }

      if(!data.password){
        throw new Error("Password is required for signup");
      }
      const hashedPassword=await this._bcryptServices.hashPassword(data.password);
      
      const login=await this._userLoginRepository.createUserLogin({
        email:data.email,
        password:hashedPassword,
        role:Role.MEDICAL_REP,
        authProvider:AuthProvider.NATIVE
      });


      return this._medicalRepRepository.createMedicalRep({
        name:data.name,
        phone:data.phone,
        companyName:data.companyName,
        companyLogoUrl:data.companyLogoUrl ?? null,
        employeeId:data.employeeId,
        subscriptionStatus:"inactive",
        maxConnectionsPerDay:10,
        loginId:login.id,
        
      })
    
}
}