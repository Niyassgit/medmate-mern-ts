import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { NotFoundError } from "../../errors";
import { DoctorDetailsDTO } from "../dto/DoctorDetailsDTO";
import { UserDetailsMapper } from "../mappers/UserDetailsMapper";

export class GetDoctorDetailsUseCase{

    constructor(
        private _doctorRepository:IDoctorRepository
    ){}

    async execute(userId:string):Promise<DoctorDetailsDTO | null>{

      const user=await this._doctorRepository.getDoctorById(userId);
      if(!user) throw new NotFoundError("User not found");
      return UserDetailsMapper.toDoctorDetails(user)
    }
}     