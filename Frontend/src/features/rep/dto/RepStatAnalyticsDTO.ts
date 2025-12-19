import { OrderTableDTO } from "./OrderTableDTO";

export interface RepStatAnalyticsDTO {
    totalRevenue: number;
    totalUnits: number;
    totalOrders: number;
    monthlyRevenue: number;
    TopProducts: {
        id: string;
        name: string;
        imageUrl: string;
    }[] | null;
    ordersList: OrderTableDTO[];
}