import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IInterestRepository } from "../../../domain/Interest/repositories/IInterestRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { NotificationType, Role } from "../../../shared/Enums";
import {
  ErrorMessages,
  NotificationMessages,
  SuccessMessages,
} from "../../../shared/Messages";
import { IEngagementEventPublisher } from "../../../domain/common/services/IEngagementEventPublisher";
import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../errors";
import { InterestResponseDTO } from "../dto/InterestResponseDTO";
import { IToggleInterestOnPostUseCase } from "../interfaces/IToggleInterestOnPostUseCase";
import { INotificationEventPublisher } from "../../../domain/common/services/INotificationEventPublisher";
import { ANotificationMapper } from "../../notification/mappers/ANotificationMapper";
import { IStorageService } from "../../../domain/common/services/IStorageService";

export class ToggleInterestOnPostUseCase
  implements IToggleInterestOnPostUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _interestRepository: IInterestRepository,
    private eventPublisher: IEngagementEventPublisher,
    private _notificationRepository: INotificationRepository,
    private _productPostRepository: IProductPostRepository,
    private _notificationEventPublisher: INotificationEventPublisher,
    private _storageService: IStorageService
  ) {}
  async exectue(postId: string, userId?: string): Promise<InterestResponseDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new BadRequestError(ErrorMessages.INVALID_REQUEST);
    const result = await this._interestRepository.toggleInterest(
      postId,
      doctorId
    );
    if (!result) throw new BadRequestError(ErrorMessages.TOGGLE_INTEREST_ERROR);
    const interestCount = await this._interestRepository.getInterestCount(
      postId
    );
    if (interestCount === undefined)
      throw new BadRequestError(ErrorMessages.INTEREST_COUNT_ERROR);
    const { repId } = await this._productPostRepository.findRepIdByPostId(
      postId
    );
    if (!repId) throw new BadRequestError(ErrorMessages.POST_NOT_FOUND);
    const { repUserId } = await this._medicalRepRepository.getUserIdByRepId(
      repId
    );
    if (!repUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    await this.eventPublisher.publishInterestToggled({
      productId: postId,
      doctorId,
      interested: result.interested,
      totalInterests: interestCount,
    });

    if (result.interested) {
      const notification =
        await this._notificationRepository.createNotification(
          userId,
          Role.DOCTOR,
          repUserId,
          Role.MEDICAL_REP,
          NotificationType.INTEREST,
          NotificationMessages.INTEREST_MESSAGE,
          postId
        );
      const result = await this._notificationRepository.findNotificationById(
        notification.id
      );
      if (!result)
        throw new NotFoundError(ErrorMessages.NOTIFICATION_NOT_FOUND);
      const mappedNtfction = await ANotificationMapper.toDomain(
        result,
        this._storageService,
        this._productPostRepository
      );
      await this._notificationEventPublisher.publishNotification({
        ...mappedNtfction,
        receiverUserId: repUserId,
      });
      const unreadCount =
        await this._notificationRepository.getCountOfUnreadNotification(
          repUserId
        );
      await this._notificationEventPublisher.unreadNotificationCount({
        receiverUserId: repUserId,
        count: unreadCount,
      });
    } else {
      const deletedId =
        await this._notificationRepository.deleteLikeNotification(
          userId,
          repUserId,
          postId
        );
      if (deletedId) {
        await this._notificationEventPublisher.deletePublishedNotification({
          notificationId: deletedId,
          receiverUserId: repUserId,
        });
        const unreadCount =
          await this._notificationRepository.getCountOfUnreadNotification(
            repUserId
          );
        await this._notificationEventPublisher.unreadNotificationCount({
          receiverUserId: repUserId,
          count: unreadCount,
        });
      }
    }
    return {
      doctorId,
      postId,
      interested: result.interested,
      totalInterests: interestCount,
      message: result.interested
        ? SuccessMessages.INTEREST_SUCCESS
        : SuccessMessages.UNINTERESTED_SUCCESS,
    };
  }
}
