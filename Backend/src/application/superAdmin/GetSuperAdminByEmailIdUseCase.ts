import { SuperAdmin } from "../../domain/superAdmin/entities/superAdmin";
import { ISuperAdminRepository } from "../../domain/superAdmin/entities/ISuperAdminRepository";



export class GetSuperAdminByEmailIdUseCase{
    
     constructor(
        private superAdminRepository:ISuperAdminRepository
     ){}

     async execute(email:string):Promise <SuperAdmin | null>{
         return await this.superAdminRepository.getSuperAdminByEmail(email);
     }
    
}