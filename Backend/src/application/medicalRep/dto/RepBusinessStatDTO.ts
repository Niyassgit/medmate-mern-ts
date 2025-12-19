export interface RepBusinessStatDTO {
    totalRevenue: number;
    totalUnits: number;
    totalOrders: number;
    monthlyRevenue: number;
    TopProducts: {
        id: string;
        name: string;
        imageUrl: string;
    }[] | null;
}