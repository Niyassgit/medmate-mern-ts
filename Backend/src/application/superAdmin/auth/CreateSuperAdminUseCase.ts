import { ISuperAdminRepository } from "../../../domain/superAdmin/repositories/ISuperAdminRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { RegisterSuperAdminDTO } from "../dto/RegisterSuperAdminDTO";
import { Role } from "../../../shared/Enums"; 
import { ConflictError, BadRequestError } from "../../../domain/common/errors";
import { UserMapper } from "../../common/mapper/UserMapper";
import { SuperAdminMapper } from "../mappers/SuperAdminMapper";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { ICreateSuperAdminUseCase } from "../interfaces/ICreateSuperAdminUseCase";

export class CreateSuperAdminUseCase implements ICreateSuperAdminUseCase{
  constructor(
    private _superAdminRepository: ISuperAdminRepository,
    private _userLoginRepository: IUserRepository,
    private _bcryptServices: IBcryptService
  ) {}

  async execute(data: RegisterSuperAdminDTO): Promise<string> {
    const existAdmin = await this._superAdminRepository.getSuperAdminByEmail(
      data.email
    );
    if (existAdmin) throw new ConflictError(ErrorMessages.USER_NOT_FOUND);

    if (!data.password) {
      throw new BadRequestError(ErrorMessages.PASSWORD_REQUIRED);
    }

    const hashedPassword = await this._bcryptServices.hash(data.password);

    const userEntity = UserMapper.toUserEntity(
      data.email,
      hashedPassword,
      Role.SUPER_ADMIN
    );
    const user = await this._userLoginRepository.createUser(userEntity);

    const adminEntity = SuperAdminMapper.toSuperAdminEntity(data, user.id);
    await this._superAdminRepository.createSuperAdmin(adminEntity);
    return SuccessMessages.REGISTER_SUCCESS;
  }
}
