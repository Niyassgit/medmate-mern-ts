import { OrderExportDTO } from "../dto/OrderExportDTO";
import { ExcelOptions } from "../../../domain/common/services/IExcelService";

export class RepOrderExportUtils {
    static getColumns(): {
        header: string;
        key: keyof OrderExportDTO;
        width: number;
    }[] {
        return [
            { header: "Order ID", key: "id", width: 30 },
            { header: "Date", key: "date", width: 15 },
            { header: "Product", key: "product", width: 25 },
            { header: "Quantity", key: "quantity", width: 10 },
            { header: "PTR/Unit", key: "ptr", width: 10 },
            { header: "Total", key: "total", width: 15 },
            { header: "Status", key: "status", width: 15 },
        ];
    }

    static getExcelOptions(startDate?: string, endDate?: string): ExcelOptions {
        const dateRange =
            startDate && endDate
                ? `From: ${new Date(startDate).toLocaleDateString()}  To: ${new Date(
                    endDate
                ).toLocaleDateString()}`
                : "All Time Report";

        return {
            title: "MedMate Sales Report",
            subTitle: dateRange,
            showTotal: true,
            totalColKey: "total",
        };
    }
}
