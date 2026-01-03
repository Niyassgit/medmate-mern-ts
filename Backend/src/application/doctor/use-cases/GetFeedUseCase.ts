import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IInterestRepository } from "../../../domain/Interest/repositories/IInterestRepository";
import { ILikeRepository } from "../../../domain/Like/repositories/ILikeRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductPostRepository } from "../../../domain/productPost/repositories/IProductPostRepository";
import { ISubscriptionRepository } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../errors";
import { FeedDTO } from "../dto/FeedDTO";
import { IGetFeedUseCase } from "../interfaces/IGetFeedUseCase";
import { FeedMapper } from "../mapper/FeedMapper";
import { SortPostBySubscription } from "../utils/SortPostBySubscription";

export class GetFeedUseCase implements IGetFeedUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _productPostRepository: IProductPostRepository,
    private _likeRepository: ILikeRepository,
    private _interestRepository: IInterestRepository,
    private _storageService: IStorageService,
    private _medicalRepRepository: IMedicalRepRepository,
    private _subscriptionRepository: ISubscriptionRepository
  ) { }
  async execute(userId: string, page: number, limit: number): Promise<FeedDTO[]> {
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const mutualConnections =
      await this._connectionRepository.doctorMutualConnectionRepIds(doctorId);
    if (!mutualConnections) return [];
    const likedIds = await this._likeRepository.getProductIdsByDoctor(doctorId);
    const interestIds = await this._interestRepository.getProductIdsByDoctorId(
      doctorId
    );
    const excludedIds = Array.from(new Set([...likedIds, ...interestIds]));
    const posts = await this._productPostRepository.getPostsByIds(
      mutualConnections,
      excludedIds
    );
    if (!posts.length) return [];

    const sortedPosts = await SortPostBySubscription.sorted(
      posts,
      this._medicalRepRepository,
      this._subscriptionRepository
    );

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    return FeedMapper.toListFeeds(paginatedPosts, this._storageService);
  }
}
