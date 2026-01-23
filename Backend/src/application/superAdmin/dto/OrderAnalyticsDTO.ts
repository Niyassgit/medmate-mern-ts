import { OrderDetailsResponseDTO } from "./OrderDetailsResponseDTO";

export interface OrderAnalyticsDTO {
  summary: {
    totalPrescriptions: number;
    paidOrders: number;
    grossAmount: number;
    doctorEarnings: number;
    adminEarnings: number;
  };

  charts: {
    revenueOverTime: {
      date: string;
      amount: number;
    }[];

    paidVsUnpaid: {
      paid: number;
      unpaid: number;
    };

    earningsSplit: {
      doctor: number;
      admin: number;
    };

    salesByCompany: {
      name: string;
      value: number;
    }[];

    topDoctors: {
      name: string;
      value: number;
    }[];
  };

  recentOrders: OrderDetailsResponseDTO[];
}
