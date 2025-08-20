import { SuperAdmin } from "../../../domain/superAdmin/entities/SuperAdmin";
import { ISuperAdminRepository } from "../../../domain/superAdmin/entities/ISuperAdminRepository";



export class GetSuperAdminByEmailIdUseCase{
    
     constructor(
        private _superAdminRepository:ISuperAdminRepository
     ){}

     async execute(email:string):Promise <SuperAdmin | null>{
         return await this._superAdminRepository.getSuperAdminByEmail(email);
     }
    
}