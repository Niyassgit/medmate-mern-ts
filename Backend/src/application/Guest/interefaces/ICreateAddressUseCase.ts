import { AddressDTO } from "../dto/AddressDTO";

export interface ICreateAddressUseCase {
    execute(dto: AddressDTO, userId?: string): Promise<AddressDTO>;
}