export interface RecentOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  guest?: {
    name: string;
  };
  prescription?: {
    doctor?: {
      name: string;
    };
  };
}

export interface TopDoctor {
  name: string;
  value: number;
}

export interface OrderAnalyticsResponse {
  summary: {
    totalPrescriptions: number;
    paidOrders: number;
    grossAmount: number;
    doctorEarnings: number;
    adminEarnings: number;
  };
  charts: {
    revenueOverTime: { date: string; amount: number }[];
    paidVsUnpaid: { paid: number; unpaid: number };
    earningsSplit: { doctor: number; admin: number };
    salesByCompany: { name: string; value: number }[];
    topDoctors: TopDoctor[];
  };
  recentOrders: RecentOrder[];
}