import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ILikeRepository } from "../../../domain/Like/repositories/ILikeRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { IEngagementEventPublisher } from "../../common/interfaces/IEngagementEventPublisher";
import { BadRequestError, NotFoundError, UnautharizedError } from "../../errors";
import { LikedResponseDTO } from "../dto/LikedResponseDTO";
import { IToggleLikeOnPostUseCase } from "../interfaces/IToggleLikeOnPostUseCase";

export class ToggleLikeOnPostUseCase implements IToggleLikeOnPostUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _likeRepository: ILikeRepository,
    private _eventPublisher:IEngagementEventPublisher
  ) {}
  async execute(postId: string, userId?: string): Promise<LikedResponseDTO> {
    if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const {doctorId} = await this._doctorRepository.getDoctorIdByUserId(userId);
    if (!doctorId) throw new NotFoundError(ErrorMessages.INVALID_REQUEST);
    const result = await this._likeRepository.toggleLike(postId,doctorId);
    if (!result) throw new BadRequestError(ErrorMessages.TOGGLE_LIKE_ERROR);
    const totalLikes = await this._likeRepository.getLikeCount(postId);
    if (totalLikes === undefined) throw new BadRequestError(ErrorMessages.LIKE_COUNT_ERROR);
    await this._eventPublisher.publishLikeToggled({
        productId:postId,
        doctorId,
        liked:result.liked,
        totalLikes,
    })
    return {
      postId,
      doctorId,
      totalLikes,
      liked: result.liked,
      message: result.liked
        ? SuccessMessages.LIKE_SUCCESS
        : SuccessMessages.UNLIKE_SUCCESS,
    };
  }
}
