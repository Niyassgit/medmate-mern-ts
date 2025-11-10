import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IInterestRepository } from "../../../domain/Interest/repositories/IInterestRepository";
import { ILikeRepository } from "../../../domain/Like/repositories/ILikeRepository";
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
        private _likeRepository:ILikeRepository,
        private _interestRepository:IInterestRepository,
        private _storageService:IStorageService
    ){}
    async execute(userId: string): Promise<FeedDTO[]> {
        const {doctorId}=await this._doctorRepository.getDoctorIdByUserId(userId);
        if(!doctorId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        const mutualConnections=await this._connectionRepository.doctorMutualConnectionRepIds(doctorId);
        if(!mutualConnections) return [];
        const likedIds=await this._likeRepository.getProductIdsByDoctor(doctorId);
        const interestIds=await this._interestRepository.getProductIdsByDoctorId(doctorId);
        const excludedIds=Array.from(new Set([...likedIds,...interestIds]));
        const posts=await this._productPostRepository.getPostsByIds(mutualConnections,excludedIds);
        if(!posts.length) return [];
        return FeedMapper.toListFeeds(posts,this._storageService);
    }
}