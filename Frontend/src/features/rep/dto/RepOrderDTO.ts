export interface IRepOrder {
    id: string;
    prescriptionId: string;
    doctorName: string;
    hospital: string;
    status: string; // OrderStatus
    totalAmount: string;
    totalUnits: number;
    createdAt: string; // Received as string from JSON
    products: {
        id: string;
        name: string;
        image: string | null;
        ptr: number;
        unit: number;
    }[];
}
