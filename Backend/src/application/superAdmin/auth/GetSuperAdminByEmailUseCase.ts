import { ISuperAdmin } from "../../../domain/superAdmin/entities/ISuperAdmin";
import { ISuperAdminRepository } from "../../../domain/superAdmin/repositories/ISuperAdminRepository";
import { IGetSuperAdminByEmailUseCase } from "../interfaces/IGetSuperAdminByEmailUseCase";

export class GetSuperAdminByEmailUseCase implements IGetSuperAdminByEmailUseCase{
  constructor(private _superAdminRepository: ISuperAdminRepository) {}

  async execute(email: string): Promise<ISuperAdmin | null> {
    return await this._superAdminRepository.getSuperAdminByEmail(email);
  }
}
