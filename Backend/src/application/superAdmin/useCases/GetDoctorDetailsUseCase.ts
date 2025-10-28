import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { NotFoundError } from "../../errors";
import { DoctorDetailsDTO } from "../../doctor/dto/DoctorDetailsDTO";
import { DoctorDetailsMapper } from "../../doctor/mapper/DoctorDetailsMapper";
import { IGetDoctorDetailsUseCase } from "../interfaces/IGetDoctorDetailsUseCase";
import { ErrorMessages } from "../../../shared/Messages";
import { IStorageService } from "../../../domain/common/services/IStorageService";

export class GetDoctorDetailsUseCase implements IGetDoctorDetailsUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _storageService:IStorageService
  ) {}

  async execute(userId: string): Promise<DoctorDetailsDTO | null> {
    const doctor = await this._doctorRepository.getDoctorById(userId);
    if (!doctor) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    let signedUrl=null;
    if(doctor.user?.profileImage){
      signedUrl=await this._storageService.generateSignedUrl(doctor.user.profileImage);
    }
    return DoctorDetailsMapper.toDoctorDetails(doctor,signedUrl);
  }
}
