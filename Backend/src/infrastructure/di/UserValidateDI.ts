import { UserRepository } from "../repositories/UserRepository";
import { UserValidationService } from "../../application/common/services/UserValidationService";

const userRepository=new UserRepository()
export const UserValidate=new UserValidationService(userRepository);