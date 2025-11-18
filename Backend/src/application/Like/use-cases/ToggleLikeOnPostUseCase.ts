import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ILikeRepository } from "../../../domain/Like/repositories/ILikeRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { NotificationType, Role } from "../../../shared/Enums";
import {
  ErrorMessages,
  NotificationMessages,
  SuccessMessages,
} from "../../../shared/Messages";
import { IEngagementEventPublisher } from "../../common/interfaces/IEngagementEventPublisher";
import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../errors";
import { LikedResponseDTO } from "../dto/LikedResponseDTO";
import { IToggleLikeOnPostUseCase } from "../interfaces/IToggleLikeOnPostUseCase";

export class ToggleLikeOnPostUseCase implements IToggleLikeOnPostUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _likeRepository: ILikeRepository,
    private _eventPublisher: IEngagementEventPublisher,
    private _notificationRepository: INotificationRepository,
    private _productPostRepository: IProductPostRepository
  ) {}
  async execute(postId: string, userId?: string): Promise<LikedResponseDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new NotFoundError(ErrorMessages.INVALID_REQUEST);
    const result = await this._likeRepository.toggleLike(postId, doctorId);
    if (!result) throw new BadRequestError(ErrorMessages.TOGGLE_LIKE_ERROR);
    const totalLikes = await this._likeRepository.getLikeCount(postId);
    if (totalLikes === undefined)
      throw new BadRequestError(ErrorMessages.LIKE_COUNT_ERROR);
    const { repId } = await this._productPostRepository.findRepIdByPostId(
      postId
    );
    if (!repId) throw new BadRequestError(ErrorMessages.POST_NOT_FOUND);
    const { repUserId } = await this._medicalRepRepository.getUserIdByRepId(repId);
    if(!repUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    await this._eventPublisher.publishLikeToggled({
      productId: postId,
      doctorId,
      liked: result.liked,
      totalLikes,
    });
    if (result.liked) {
      await this._notificationRepository.createNotification(
        userId,
        Role.DOCTOR,
        repUserId,
        Role.MEDICAL_REP,
        NotificationType.LIKE,
        NotificationMessages.LIKE_MESSAGE,
        postId
      );
    } else {
      await this._notificationRepository.deleteLikeNotification(
        userId,
        repUserId,
        postId
      );
    }

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
