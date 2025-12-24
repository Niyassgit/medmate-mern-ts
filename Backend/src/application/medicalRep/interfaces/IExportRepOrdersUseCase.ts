export interface IExportRepOrdersUseCase {
    execute(userId?: string, startDate?: string, endDate?: string): Promise<Buffer>;
}
