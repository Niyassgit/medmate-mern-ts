import { IConnectionRequestLogRepository } from "../../../domain/connection/repositories/IConnectionRequestLogRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { NotFoundError, UnautharizedError } from "../../errors";
import { ConnectionRequestStatsDTO } from "../dto/ConnectionRequestStatsDTO";

export interface IGetConnectionRequestStatsUseCase {
  execute(userId: string): Promise<ConnectionRequestStatsDTO>;
}

export class GetConnectionRequestStatsUseCase
  implements IGetConnectionRequestStatsUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _connectionRequestLogRepository: IConnectionRequestLogRepository
  ) {}

  async execute(userId: string): Promise<ConnectionRequestStatsDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const repDetails = await this._medicalRepRepository.getMedicalRepById(
      repId
    );
    if (!repDetails) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const isSubscribed = !!(
      repDetails.subscriptionStatus &&
      repDetails.subscriptionEnd &&
      new Date(repDetails.subscriptionEnd) > new Date()
    );
    const todayCount =
      await this._connectionRequestLogRepository.getTodayRequestCount(repId);

    const DEFAULT_LIMIT = 3;
    const limit = isSubscribed ? null : DEFAULT_LIMIT;
    const remaining = limit !== null ? Math.max(0, limit - todayCount) : null;

    return {
      used: todayCount,
      limit,
      remaining,
      isSubscribed,
    };
  }
}
