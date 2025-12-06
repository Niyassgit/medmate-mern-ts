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
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { MedicalRepFilterService } from "../services/MedicalRepFilterService";
import { RepNetworkEvaluator } from "../services/RepNetworkEvaluator";

export class NetworksUseCase implements INetworkUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _storageService: IStorageService,
    private _connectionRepository: IConnectionRepository
  ) {}
  async execute(
    userId: string,
    search?: string,
    filters?: {
      company?: string;
      territories?: string[];
    }
  ): Promise<NetworkResponseDTO[] | null> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    if (user.role !== Role.DOCTOR)
      throw new UnautharizedError(ErrorMessages.DOCTOR_ACCESS);
    const doctor = await this._doctorRepository.getDoctorByUserId(userId);
    if (!doctor || !doctor.departmentId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { departmentId } = doctor;
    
 
    const reps = await this._medicalRepRepository.findByDepartment(
      departmentId
    );
    if (!reps) return null;
    const filteredRep = MedicalRepFilterService.apply(reps, search, filters);
    const connections =
      await this._connectionRepository.findConnectionsForDoctor(doctor.id);
    const evaluatedReps = RepNetworkEvaluator.evaluate(
      filteredRep,
      connections
    );

    const sortedReps = evaluatedReps.sort((a, b) => {
      const aSubscribed = a.subscriptionStatus === true ? 1 : 0;
      const bSubscribed = b.subscriptionStatus === true ? 1 : 0;
      return bSubscribed - aSubscribed;
    });

    return sortedReps.length
      ? Promise.all(
          sortedReps.map((rep) =>
            NetworkMapper.toResponse(
              rep,
              this._storageService,
              rep.connectionStatus,
              rep.connectionInitiator
            )
          )
        )
      : null;
  }
}
