import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { DoctorDetailsMapper } from "../../doctor/mapper/DoctorDetailsMapper";
import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../errors";
import { DoctorDetailsOnRepDTO } from "../dto/DoctorDetailsOnRepDTO";
import { IGetDoctorDetailsOnRepSideUseCase } from "../interfaces/IGetDoctorDetailsOnRepSideUseCase";

export class GetDoctorDetailsOnRepSideUseCase
  implements IGetDoctorDetailsOnRepSideUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _storageService: IStorageService,
    private _connectionRepository:IConnectionRepository
  ) {}
  async execute(
    doctorId: string,
    userId?: string
  ): Promise<DoctorDetailsOnRepDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const user = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!user.repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const doctorDetails = await this._doctorRepository.getDoctorById(doctorId);
    if (!doctorDetails) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const connection=await this._connectionRepository.findByDoctorAndRep(doctorId,user.repId);
    const statusConnection=connection?connection.status:null;
    const profileImage = doctorDetails.user?.profileImage
      ? await this._storageService.generateSignedUrl(
          doctorDetails.user?.profileImage
        )
      : null;
    const mappedDoctor = DoctorDetailsMapper.toDoctorDetails(
      doctorDetails,
      profileImage
    );
   return {
    ...mappedDoctor,
    createdAt:doctorDetails.createdAt,
    connectionStatus:statusConnection,
   }
  }
}
