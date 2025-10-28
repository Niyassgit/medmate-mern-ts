import { ISuperAdmin } from "../../../domain/superAdmin/entities/ISuperAdmin";

export interface IGetSuperAdminByEmailUseCase{
    execute(email:string):Promise<ISuperAdmin | null>
}