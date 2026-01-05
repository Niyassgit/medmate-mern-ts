import { IAddressRepository } from "../../../domain/address/repository/IAddressRepository";
import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IGuestRepository } from "../../../domain/guest/repositories/IGuestRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { IDeleteAddressUseCase } from "../interefaces/IDeleteAddressUseCase";

export class DeleteAddressUseCase implements IDeleteAddressUseCase {
  constructor(
    private _guestRepository: IGuestRepository,
    private _addressRepository: IAddressRepository
  ) {}

  async execute(addressId: string, userId?: string): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { guestId } = await this._guestRepository.findGuestIdByUserId(userId);
    if (!guestId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    const address = await this._addressRepository.findAddressById(addressId);
    if (!address) throw new BadRequestError(ErrorMessages.ADDRESS_NOT_FOUND);

    if (address.guestId !== guestId) {
      throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    }

    await this._addressRepository.deleteAddress(addressId);

    return SuccessMessages.DEPARTMENT_SUCCESS;
  }
}
