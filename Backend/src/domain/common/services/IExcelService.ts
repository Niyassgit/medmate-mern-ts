export interface ExcelOptions {
    title?: string;
    subTitle?: string;
    showTotal?: boolean;
    totalColKey?: string;
}

export interface IExcelService {
    generateExcel<T>(
        data: T[],
        columns: { header: string; key: keyof T; width: number }[],
        sheetName: string,
        options?: ExcelOptions
    ): Promise<Buffer>;
}
