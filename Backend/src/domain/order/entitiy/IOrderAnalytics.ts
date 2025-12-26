export interface IOrderAnalytics {
  totalPrescriptions: number;
  paidOrders: number;
  unpaidPrescriptions: number;

  grossAmount: number;
  doctorEarnings: number;
  adminEarnings: number;

  revenueTimeline: RevenueTimelinePoint[];
  paidVsUnpaid: PaidVsUnpaid;
  earningsSplit: EarningsSplit;
}

export interface RevenueTimelinePoint {
  date: string;
  amount: number;
}

export interface PaidVsUnpaid {
  paid: number;
  unpaid: number;
}

export interface EarningsSplit {
  doctor: number;
  admin: number;
}
