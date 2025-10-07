import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { UserProfileDTO } from "../../common/dto/UserProfileDTO";
import { UserMapper } from "../../common/mapper/UserMapper";
import { NotFoundError } from "../../errors";
import { DoctorDetailsDTO } from "../dto/DoctorDetailsDTO";
import { DoctorDetailsMapper } from "../mapper/DoctorDetailsMapper";



export class GetDoctorProfileByIdUseCase{
    constructor(
        private _doctorRepository:IDoctorRepository,
        private _userRepository:IUserRepository
    ){}
    async execute(userId:string):Promise<DoctorDetailsDTO | UserProfileDTO | null>{
       const doctor=await this._doctorRepository.getDoctorByUserId(userId);
       if(!doctor){
           const user=await this._userRepository.findById(userId);
            if(!user) throw new NotFoundError("User is not found");
            return UserMapper.toUserProfile(user);
       }
      
       return DoctorDetailsMapper.toDoctorDetails(doctor);
    }
}