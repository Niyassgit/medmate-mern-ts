import { IAddressRepository } from "../../../domain/address/repository/IAddressRepository";
import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IGuestRepository } from "../../../domain/Guest/repositories/IGuestRepositories";
import { ErrorMessages } from "../../../shared/Messages";
import { AddressDTO } from "../dto/AddressDTO";
import { IGetAllAddressUseCase } from "../interefaces/IGetAllAddressUseCase";
import { AddressMapper } from "../mappers/AddressMapper";

export class GetAllAddressUseCase implements IGetAllAddressUseCase {
  constructor(
    private _guestRepository: IGuestRepository,
    private _addressRepository: IAddressRepository
  ) {}
  async execute(userId?: string): Promise<AddressDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { guestId } = await this._guestRepository.findGuestIdByUserId(userId);
    if (!guestId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const addresses = await this._addressRepository.findAllAddress(guestId);
    return addresses.map((A) => AddressMapper.toDomain(A));
  }
}
