import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { AuthProvider } from "../../../domain/common/value-objects/AuthProvider";
import { ConflictError, BadRequestError } from "../../../domain/common/errors";
import { IUser } from "../../../domain/common/entities/IUser";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { ICreateUserUseCase } from "../interfaces/ICreateUserUseCase";

export class CreateUserUseCase implements ICreateUserUseCase{
  constructor(
    private _userRepository: IUserRepository,
    private _bcryptServices: IBcryptService
  ) {}

  async execute(
    data: CreateUserDTO
  ): Promise<IUser> {
    const existUser = await this._userRepository.findByEmail(data.email);

    if (existUser) throw new ConflictError("Email already exists");

    if (data.authProvider === AuthProvider.NATIVE && !data.password) {
      throw new BadRequestError("Password is required");
    }

    const hashedPassword = data.password
      ? await this._bcryptServices.hash(data.password)
      : null;
    return this._userRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }
}
