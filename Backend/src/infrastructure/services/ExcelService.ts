import ExcelJS from "exceljs";
import { IExcelService, ExcelOptions } from "../../domain/common/services/IExcelService";

export class ExcelService implements IExcelService {
    async generateExcel<T>(
        data: T[],
        columns: { header: string; key: keyof T; width: number }[],
        sheetName: string,
        options?: ExcelOptions
    ): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        let currentRow = 1;


        if (options?.title) {
            worksheet.mergeCells(`A${currentRow}:G${currentRow}`);
            const titleRow = worksheet.getRow(currentRow);
            titleRow.getCell(1).value = options.title;
            titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            titleRow.getCell(1).font = { bold: true, size: 16 };
            titleRow.height = 30;
            currentRow++;
        }

        if (options?.subTitle) {
            worksheet.mergeCells(`A${currentRow}:G${currentRow}`);
            const subTitleRow = worksheet.getRow(currentRow);
            subTitleRow.getCell(1).value = options.subTitle;
            subTitleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            subTitleRow.getCell(1).font = { italic: true, size: 12 };
            currentRow++;
        }

        // Space before header
        currentRow++;

        // Header
        const headerRow = worksheet.getRow(currentRow);
        columns.forEach((col, index) => {
            const cell = headerRow.getCell(index + 1);
            cell.value = col.header;
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center" };
            worksheet.getColumn(index + 1).width = col.width;
            worksheet.getColumn(index + 1).key = String(col.key);
        });
        currentRow++;

        data.forEach((row) => {
            const dataRow = worksheet.getRow(currentRow);
            columns.forEach((col, index) => {
                const cell = dataRow.getCell(index + 1);
                const cellValue = row[col.key];
                cell.value = cellValue as string | number | boolean | Date | null | undefined;
                cell.alignment = { horizontal: "center" };
            });
            currentRow++;
        });

        if (options?.showTotal && options.totalColKey) {
            currentRow++;
            const totalRow = worksheet.getRow(currentRow);
            const totalColIndex = columns.findIndex(c => String(c.key) === options.totalColKey) + 1;

            const totalLabelCell = totalRow.getCell(totalColIndex - 1);
            totalLabelCell.value = "Grand Total:";
            totalLabelCell.font = { bold: true };
            totalLabelCell.alignment = { horizontal: "right" };

            const totalValue = data.reduce((sum, item) => sum + (Number(item[options.totalColKey as keyof T]) || 0), 0);
            const totalValueCell = totalRow.getCell(totalColIndex);
            totalValueCell.value = totalValue;
            totalValueCell.font = { bold: true };
            totalValueCell.alignment = { horizontal: "center" };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
}
