import { ICommissionWithProduct } from "../../../domain/commission/entities/ICommissionWithProduct";
import { DoctorCommissionDashboardDTO } from "../dto/DoctorCommissionDashboardDTO";
import { DoctorCommissionItemDTO } from "../dto/DoctorCommissionItemDTO ";
import { CommissionStatus } from "../../../shared/Enums";
import { CommissionPeriodUtil, CommissionPeriod } from "../utils/CommissionPeriodUtil";

export class CommissionMapper {
  static toDomain(
    commissions: ICommissionWithProduct[],
    period: CommissionPeriod = "monthly",
    startDate?: Date,
    endDate?: Date,
    totalPrescriptions: number = 0
  ): DoctorCommissionDashboardDTO {


    const totalEarnings = commissions.reduce(
      (sum, c) => sum + c.doctorCut,
      0
    );

    const settledEarnings = commissions
      .filter(c => c.status === CommissionStatus.SETTLED)
      .reduce((sum, c) => sum + c.doctorCut, 0);

    const pendingEarnings = commissions
      .filter(c => c.status === CommissionStatus.PENDING)
      .reduce((sum, c) => sum + c.doctorCut, 0);

    const totalOrders = new Set(
      commissions.map(c => c.orderId)
    ).size;

    const totalProducts = commissions.length;

    const timeline = CommissionPeriodUtil.groupCommissionsByPeriod(
      commissions,
      period,
      startDate,
      endDate
    );


    const commissionItems = this.mapCommissionsToDTO(commissions);

    return {
      summary: {
        totalEarnings,
        settledEarnings,
        pendingEarnings,
        totalOrders,
        totalProducts,
        totalPrescriptions,
      },
      timeline,
      commissions: commissionItems,
    };
  }


  static mapCommissionsToDTO(
    commissions: ICommissionWithProduct[]
  ): DoctorCommissionItemDTO[] {
    return commissions.map((c) => ({
      commissionId: c.id,
      orderId: c.orderId,
      productName: c.product?.name ?? "Unknown Product",
      productId: c.productId,
      mrp: c.mrp,
      ptr: c.ptr,
      doctorEarning: c.doctorCut,
      status: c.status,
      earnedAt: c.createdAt,
    }));
  }
}
