import { ISuperAdminRepository } from "../../../domain/superAdmin/repositories/ISuperAdminRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { RegisterSuperAdminDTO } from "../dto/RegisterSuperAdminDTO";
import { Role } from "../../../domain/common/entities/IUser";
import { ConflictError, BadRequestError } from "../../../domain/common/errors";
import { UserMapper } from "../../common/mapper/UserMapper";
import { SuperAdminMapper } from "../mappers/SuperAdminMapper";
export class CreateSuperAdminUseCase {
  constructor(
    private _superAdminRepository: ISuperAdminRepository,
    private _userLoginRepository: IUserRepository,
    private _bcryptServices: IBcryptService
  ) {}

  async execute(data: RegisterSuperAdminDTO): Promise<string> {
    const existAdmin = await this._superAdminRepository.getSuperAdminByEmail(
      data.email
    );
    if (existAdmin) throw new ConflictError(`User already exists`);

    if (!data.password) {
      throw new BadRequestError("Password is Required for signup");
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
    return "Admin registered successfully";
  }
}
