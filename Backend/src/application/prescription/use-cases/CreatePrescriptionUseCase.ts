import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IPrescriptionRepository } from "../../../domain/prescription/repositories/IPrescriptionRepository";
import { IPrescriptionItemRepository } from "../../../domain/prescription/repositories/IPrescriptionItemRepository";
import { ErrorMessages, NotificationMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError,UnautharizedError } from "../../../domain/common/errors";
import { PrescriptionDTO } from "../dto/PrescriptionDTO";
import { ICreatePrescriptionUseCase } from "../interfaces/ICreatePrescriptionUseCase";
import { PrescriptionMapper } from "../mappers/PrescriptionMapper";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { ITokenService } from "../../../domain/common/services/ITokenSerivce";
import { IConfigService } from "../../../domain/common/services/IConfigService";


export class CreatePrescriptionUseCase implements ICreatePrescriptionUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _prescriptionRepository: IPrescriptionRepository,
    private _prescriptionItemRepository: IPrescriptionItemRepository,
    private _guestRepository: IGuestRepository,
    private _notificationService: INotificationService,
    private _tokenService: ITokenService,
    private _configService: IConfigService
  ) { }
  async execute(
    guestId: string,
    dto: PrescriptionDTO,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestError(ErrorMessages.PRESCRIPTION_ITEM_NEEDED);
    }

    if (dto.expiresAt && new Date(dto.expiresAt) < new Date()) {
      throw new BadRequestError(ErrorMessages.INVALID_DATE);
    }

    if (dto.linkExpiresAt && new Date(dto.linkExpiresAt) < new Date()) {
      throw new BadRequestError(ErrorMessages.INVALID_DATE);
    }

    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const guest = await this._guestRepository.findGuestById(guestId);
    if (!guest) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    let shareToken = dto.shareToken;
    if (!shareToken && !guest.isRegistered && guest.email) {
      shareToken = await this._tokenService.generateUrlSafeToken();
    }
    const mappedData = PrescriptionMapper.toEntity(
      { ...dto, shareToken },
      doctorId,
      guestId
    );
    const prescription = await this._prescriptionRepository.createPrescription(
      mappedData
    );
    if (!prescription) throw new BadRequestError(ErrorMessages.OPERATION_FAILE);

    const prescriptionItems = dto.items.map((item) =>
      PrescriptionMapper.toPrescriptionItemEntity(item, prescription.id)
    );

    await this._prescriptionItemRepository.createPrescriptionItems(
      prescriptionItems
    );
    if (!guest.isRegistered && guest.email && shareToken) {
      const registrationLink = `${this._configService.getOrigin()}/register/guest/${shareToken}`;

      await this._notificationService.sendEmail(
        guest.email,
        NotificationMessages.PRESCRIPTION_INVITATION_SUBJECT,
        NotificationMessages.PRESCRIPTION_INVITATION_BODY(
          guest.name,
          registrationLink
        )
      );
    }

    return SuccessMessages.PRESCRIPTION_CREATED;
  }
}
