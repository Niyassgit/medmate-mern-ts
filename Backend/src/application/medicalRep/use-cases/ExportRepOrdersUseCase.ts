import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IExportRepOrdersUseCase } from "../interfaces/IExportRepOrdersUseCase";
import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { ErrorMessages } from "../../../shared/Messages";
import { PrescriptionOrderMapper } from "../mapper/PrescriptionOrderMapper";
import { IExcelService } from "../../../domain/common/services/IExcelService";
import { OrderExportDTO } from "../dto/OrderExportDTO";
import { RepOrderExportUtils } from "../utils/RepOrderExportUtils";

export class ExportRepOrdersUseCase implements IExportRepOrdersUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _orderRepository: IOrderRepository,
    private _excelService: IExcelService
  ) {}

  async execute(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<Buffer> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const repData = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repData || !repData.repId) {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }
    const repId = repData.repId;

    let start: Date | undefined;
    let end: Date | undefined;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    }

    const orders = await this._orderRepository.getRepAnalytics(
      repId,
      start,
      end
    );
    const excelData = PrescriptionOrderMapper.toExcelData(orders, repId);
    const columns = RepOrderExportUtils.getColumns();
    const options = RepOrderExportUtils.getExcelOptions(startDate, endDate);
    return await this._excelService.generateExcel<OrderExportDTO>(
      excelData,
      columns,
      "Orders",
      options
    );
  }
}
