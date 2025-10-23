import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { DoctorNetworkCardDTO } from "../dto/DocrtorNetworkCardDTO";
import { IGetNetworksUseCase } from "../interfaces/IGetNetWorksUseCase";
import { NetworkMapper } from "../mapper/NetworkMapper";


export class GetNetworksUseCase implements IGetNetworksUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _doctorRepository:IDoctorRepository,
        private _medicalRepRepository:IMedicalRepRepository,
        private _storageService:IStorageService
    ){}
    async execute(userId: string): Promise<DoctorNetworkCardDTO[] | null> {
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const rep=await this._medicalRepRepository.getMedicalRepByUserId(userId);
        if(!rep) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const {territories,departmentId}=rep;
        const doctors=await this._doctorRepository.findByTerritoryAndDepartment(departmentId,territories);
        if(!doctors) return null;
        return await NetworkMapper.toResponseList(doctors,this._storageService);
    }
}