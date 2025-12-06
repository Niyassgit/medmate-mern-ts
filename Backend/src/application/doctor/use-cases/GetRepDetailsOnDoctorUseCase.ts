import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { NotFoundError, UnautharizedError } from "../../errors";
import { MedicalRepMapper } from "../../medicalRep/mapper/MedicalRepMapper";
import { ProductPostMapper } from "../../productPost/mappers/ProductPostMapper";
import { RepDetailsResponseOnDoctorDTO } from "../dto/RepDetailsResponseOnDoctorDTO";
import { IGetRepDetailsOnDoctorUseCase } from "../interfaces/IGetRepDetailsOnDoctorUseCase";


export class GetRepDetailsOnDoctorUseCase implements IGetRepDetailsOnDoctorUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _medicalRepRepository:IMedicalRepRepository,
        private _productPostRepository:IProductPostRepository,
        private _storageService:IStorageService,
        private _connectionRepository:IConnectionRepository,
        private _doctorRepository:IDoctorRepository
    ){}
    async execute(repId: string, userId?: string): Promise<RepDetailsResponseOnDoctorDTO> {
        if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        
        const doctor = await this._doctorRepository.getDoctorByUserId(userId);
        if(!doctor) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        
        const repDetails=await this._medicalRepRepository.getMedicalRepById(repId);
        if(!repDetails) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        
        const connection = await this._connectionRepository.findConnectionBetweenDoctorAndRep(
            doctor.id,
            repId
        );
        
        const connectionStatus = connection?.status ?? null;
        const connectionInitiator = connection?.initiator ?? null;
        
        const mappedRep=await MedicalRepMapper.repDetailsOnDoctorDomain(
            repDetails,
            this._storageService,
            connectionStatus,
            connectionInitiator
        );
        const post=await this._productPostRepository.findPostsByRepId(repId);
        const mappedPost=post?await ProductPostMapper.toRelatedProductsDomain(post,this._storageService):[];
        return {
            medicalRep:mappedRep,
            posts:mappedPost
        }
    }
}