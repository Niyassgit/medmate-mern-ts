import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IInterestRepository } from "../../../domain/Interest/repositories/IInterestRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { IEngagementEventPublisher } from "../../common/interfaces/IEngagementEventPublisher";
import { BadRequestError, UnautharizedError } from "../../errors";
import { InterestResponseDTO } from "../dto/InterestResponseDTO";
import { IToggleInterestOnPostUseCase } from "../interfaces/IToggleInterestOnPostUseCase";

export class ToggleInterestOnPostUseCase
  implements IToggleInterestOnPostUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _interestRepository: IInterestRepository,
    private eventPublisher:IEngagementEventPublisher
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
    console.log("🔁 Publishing interest event:", result);

    const interestCount = await this._interestRepository.getInterestCount(
      postId
    );
    if (interestCount === undefined)
      throw new BadRequestError(ErrorMessages.INTEREST_COUNT_ERROR);
  
    await this.eventPublisher.publishInterestToggled({
        productId:postId,
        doctorId,
        interested:result.interested,
        totalInterests:interestCount
    })
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
