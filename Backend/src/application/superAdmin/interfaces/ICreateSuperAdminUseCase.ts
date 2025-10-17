import { RegisterSuperAdminDTO } from "../dto/RegisterSuperAdminDTO";

export interface ICreateSuperAdminUseCase{
    execute(data:RegisterSuperAdminDTO):Promise<string>;
}