import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { ISubscriptionHistoryRepository } from "../../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { StatusSummaryDTO } from "../dto/StatsSummaryDTO";
import { IGetAdminDashBoardSummaryUseCase } from "../interfaces/IGetAdminDashboardSummaryUseCase";
import { UnautharizedError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";

export class GetAdminDashboardSummaryUseCase
  implements IGetAdminDashBoardSummaryUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _subscriptionHistoryRepository: ISubscriptionHistoryRepository,
    private _productPostRepository: IProductPostRepository,
    private _connectionRepository: IConnectionRepository,
    private _userRepository: IUserRepository
  ) {}

  async execute(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<StatusSummaryDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;

    const totalDoctors = await this._doctorRepository.countDoctors(
      parsedStartDate,
      parsedEndDate
    );

    const totalReps = await this._medicalRepRepository.countReps(
      parsedStartDate,
      parsedEndDate
    );

    const allSubscriptions =
      await this._subscriptionHistoryRepository.findAllPlans();

    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const activeSubscriptions = allSubscriptions.filter(
      (sub) => sub.status === "paid" && new Date(sub.endDate) > now
    ).length;

    let revenueStartDate: Date;
    let revenueEndDate: Date;

    if (parsedStartDate && parsedEndDate) {
      revenueStartDate = parsedStartDate;
      revenueEndDate = parsedEndDate;
    } else {
      revenueStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      revenueEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const monthlyRevenue = allSubscriptions
      .filter((sub) => {
        const subDate = new Date(sub.createdAt);
        return (
          subDate >= revenueStartDate &&
          subDate <= revenueEndDate &&
          sub.status === "paid"
        );
      })
      .reduce((sum, sub) => sum + sub.amount, 0);

    const expiringPlans = allSubscriptions.filter((sub) => {
      const endDate = new Date(sub.endDate);
      return (
        sub.status === "paid" && endDate > now && endDate <= sevenDaysFromNow
      );
    }).length;

    const allConnections = await this._connectionRepository.getAll();
    const totalConnections = allConnections.length;

    const pendingValidations =
      await this._userRepository.countPendingValidations();

    const totalPosts = await this._productPostRepository.countTotalPosts();

    return {
      totalDoctors,
      totalReps,
      pendingValidations,
      activeSubscriptions,
      monthlyRevenue,
      expiringPlans,
      totalPosts,
      totalConnections,
    };
  }
}
