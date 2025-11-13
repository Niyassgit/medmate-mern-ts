import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import {NotFoundError } from "../../errors";
import { CompleteDoctorProfileDTO } from "../dto/CompleteProfileDTO";
import { ICompleteProfileUseCase} from "../interfaces/ICompleteProfileUseCase";
import { DoctorMapper } from "../mapper/DoctorMapper";
import { getOpSession } from "../utils/OpSessionUtil";


export class CompleteProfileUseCase implements ICompleteProfileUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _doctorRepository:IDoctorRepository
    ){}

    async execute(userId:string,data:CompleteDoctorProfileDTO):Promise<string>{
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const existingUser=await this._doctorRepository.getDoctorByUserId(userId);
        const opSession=getOpSession(data.opStartTime,data.opEndTime);
        const doctorEntity=DoctorMapper.toCompleteProfile(data,userId,opSession);
        if(!existingUser){
            await this._doctorRepository.createDoctor(doctorEntity);
            return SuccessMessages.PROFILE_UPDATED;
        }else{                    
           await this._doctorRepository.updateDoctor(existingUser.id,doctorEntity);
           return SuccessMessages.PROFILE_UPDATED;
        }
    }
}