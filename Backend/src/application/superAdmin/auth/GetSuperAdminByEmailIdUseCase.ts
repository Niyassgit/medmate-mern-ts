import { ISuperAdmin } from "../../../domain/superAdmin/entities/ISuperAdmin";
import { ISuperAdminRepository } from "../../../domain/superAdmin/entities/ISuperAdminRepository";



export class GetSuperAdminByEmailIdUseCase{
    
     constructor(
        private _superAdminRepository:ISuperAdminRepository
     ){}

     async execute(email:string):Promise <ISuperAdmin | null>{
         return await this._superAdminRepository.getSuperAdminByEmail(email);
     }
    
}