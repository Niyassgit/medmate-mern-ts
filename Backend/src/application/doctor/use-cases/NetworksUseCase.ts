import { NetworkResponseDTO } from "../dto/NetworkResponseDTO";
import { INetworkUseCase } from "../interfaces/INetworkUseCase";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { NotFoundError } from "../../../domain/common/errors";
import { ErrorMessages } from "../../../shared/Messages";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { Role } from "../../../shared/Enums";
import { UnautharizedError } from "../../errors";
import { NetworkMapper } from "../mapper/NetWorkMapper";
import { IStorageService } from "../../../domain/common/services/IStorageService";

export class NetworksUseCase implements INetworkUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _storageService:IStorageService
  ) {}
  async execute(userId: string): Promise<NetworkResponseDTO[]> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    if (user.role !== Role.DOCTOR)
      throw new UnautharizedError(ErrorMessages.DOCTOR_ACCESS);
    const doctor = await this._doctorRepository.getDoctorByUserId(userId);
    if (!doctor) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { territoryId, departmentId } = doctor;
    const reps = await this._medicalRepRepository.findByTerritoryAndDepartment(
      territoryId,
      departmentId
    );
    return await  NetworkMapper.toResponselist(reps,this._storageService);
  }
}
