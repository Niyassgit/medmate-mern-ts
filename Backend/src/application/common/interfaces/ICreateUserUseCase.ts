import { IUser } from "../../../domain/common/entities/IUser";
import { CreateUserDTO } from "../dto/CreateUserDTO";


export interface ICreateUserUseCase{
    execute(data:CreateUserDTO):Promise<IUser>;
}