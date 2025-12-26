import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { ErrorMessages } from "../../../shared/Messages";
import {
  BadRequestError,
  ConflictError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { ICreateGuestByDoctorUseCase } from "../interfaces/ICreateGuestByDoctorUseCase";
import { CreateGuestByDoctorDTO } from "../dto/CreateGuestByDoctorDTO";
import { GuestMapper } from "../../../infrastructure/mappers/GuestMapper";
import { IGuest } from "../../../domain/guest/entities/IGuest";

export class CreateGuestByDoctorUseCase implements ICreateGuestByDoctorUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _guestRepository: IGuestRepository
  ) {}

  async execute(dto: CreateGuestByDoctorDTO, userId?: string): Promise<IGuest> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    if (dto.email) {
      const existingGuest = await this._guestRepository.findByEmailId(
        dto.email
      );
      if (existingGuest && existingGuest.doctorId === doctorId) {
        throw new ConflictError(ErrorMessages.GUEST_ALREADY_EXISTS);
      }
    }

    const guestEntity = GuestMapper.toGuestEntityByDoctor(dto, doctorId);
    const guest = await this._guestRepository.createGuest(guestEntity);
    if (!guest) throw new BadRequestError(ErrorMessages.GUEST_CREATE);
    return guest;
  }
}
