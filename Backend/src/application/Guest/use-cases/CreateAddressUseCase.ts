import { IAddressRepository } from "../../../domain/address/repository/IAddressRepository";
import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IGuestRepository } from "../../../domain/Guest/repositories/IGuestRepositories";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { AddressDTO } from "../dto/AddressDTO";
import { ICreateAddressUseCase } from "../interefaces/ICreateAddressUseCase";
import { AddressMapper } from "../mappers/AddressMapper";

export class CreateAddressUseCase implements ICreateAddressUseCase {
  constructor(
    private _guestRepository: IGuestRepository,
    private _addressRepository: IAddressRepository
  ) { }
  async execute(dto: AddressDTO, userId?: string): Promise<AddressDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { guestId } = await this._guestRepository.findGuestIdByUserId(userId);
    if (!guestId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const mappedAddress = AddressMapper.toEntity(dto, guestId);
    const address = await this._addressRepository.createAddress(mappedAddress);
    if (!address) throw new BadRequestError(ErrorMessages.ADDRESS_ADD_FAILED);
    return AddressMapper.toDomain(address);
  }
}
