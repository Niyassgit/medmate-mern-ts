export interface AdminEarningsDTO {
    doctorId: string;
    doctorName: string;
    email: string;
    department: string;
    totalPrescriptions: number;
    paidOrders: number;
    grossSales: number;
    adminEarnings: number;
}
