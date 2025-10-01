import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import {NotFoundError } from "../../errors";
import { CompleteDoctorProfileDTO } from "../dto/CompleteProfileDTO";
import { DoctorMapper } from "../mapper/DoctorMapper";


export class CompleteProfileUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _doctorRepository:IDoctorRepository
    ){}

    async execute(userId:string,data:CompleteDoctorProfileDTO):Promise<string>{
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError("User not found");
        const existingUser=await this._doctorRepository.getDoctorByUserId(userId);
        const doctorEntity=DoctorMapper.toCompleteProfile(data,userId);
        if(!existingUser){
            await this._doctorRepository.createDoctor(doctorEntity);
            return "Doctor profile updated successfully";
        }else{                    
           await this._doctorRepository.updateDoctor(existingUser.id,doctorEntity);
           return "Doctor profile updated successfully"
        }
    }
}