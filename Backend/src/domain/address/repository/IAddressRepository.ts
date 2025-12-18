import { IAddress } from "../entities/IAddress";

export interface IAddressRepository {
  createAddress(
    data: Omit<IAddress, "id" | "createdAt" | "updatedAt">
  ): Promise<IAddress>;
  findAddressById(addressId: string): Promise<IAddress | null>;
  updateAddress(
    addressId: string,
    data: Omit<IAddress, "id" | "createdAt" | "updatedAt">
  ): Promise<IAddress>;
  deleteAddress(addressId:string):Promise<void>;
  findAllAddress(guestId:string):Promise<IAddress[]>;
}
