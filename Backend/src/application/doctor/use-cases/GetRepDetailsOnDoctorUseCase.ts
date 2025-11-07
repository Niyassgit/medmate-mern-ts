import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
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
        private _storageService:IStorageService
    ){}
    async execute(repId: string, userId?: string): Promise<RepDetailsResponseOnDoctorDTO> {
        if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const repDetails=await this._medicalRepRepository.getMedicalRepById(repId);
        if(!repDetails) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const mappedRep=await MedicalRepMapper.repDetailsOnDoctorDomain(repDetails,this._storageService);
        const post=await this._productPostRepository.findPostsByRepId(repId);
        const mappedPost=post?await ProductPostMapper.toRelatedProductsDomain(post,this._storageService):[];
        return {
            medicalRep:mappedRep,
            posts:mappedPost
        }
    }
}