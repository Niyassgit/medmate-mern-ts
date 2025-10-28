import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../errors";
import { FeedDTO } from "../dto/FeedDTO";
import { IGetFeedUseCase } from "../interfaces/IGetFeedUseCase";
import { FeedMapper } from "../mapper/FeedMapper";


export class GetFeedUseCase implements IGetFeedUseCase{
    constructor(
        private _doctorRepository:IDoctorRepository,
        private _connectionRepository:IConnectionRepository,
        private _productPostRepository:IProductPostRepository,
        private _storageService:IStorageService
    ){}
    async execute(userId: string): Promise<FeedDTO[]> {
        const user=await this._doctorRepository.getDoctorIdByUserId(userId);
        if(!user || !user.doctorId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        const mutualConnections=await this._connectionRepository.doctorMutualConnectionRepIds(user.doctorId);
        if(!mutualConnections) return [];
        const posts=await this._productPostRepository.getPostsByIds(mutualConnections);
        if(!posts.length) return [];
        return FeedMapper.toListFeeds(posts,this._storageService);
    }
}