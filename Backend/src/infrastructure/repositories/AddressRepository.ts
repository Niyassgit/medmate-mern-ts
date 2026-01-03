import { Address, Prisma } from "@prisma/client";
import { IAddress } from "../../domain/address/entities/IAddress";
import { IAddressRepository } from "../../domain/address/repository/IAddressRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../config/db";
import { AddressMapper } from "../mappers/AddressMapper";
import { NotFoundError } from "../../domain/common/errors";
import { ErrorMessages } from "../../shared/Messages";

export class AddressRepository
  extends BaseRepository<
    IAddress,
    Address,
    Prisma.AddressCreateInput,
    "address"
  >
  implements IAddressRepository {
  constructor() {
    super(prisma.address, (a) => AddressMapper.toDomain(a));
  }

  async createAddress(
    data: Omit<IAddress, "id" | "createdAt" | "updatedAt">
  ): Promise<IAddress> {
    const mappedData = AddressMapper.toPersistance(data);
    return this.create(mappedData);
  }

  async findAddressById(addressId: string): Promise<IAddress | null> {
    return this.findById(addressId);
  }

  async findAllAddress(guestId: string): Promise<IAddress[]> {
    const result = await prisma.address.findMany({
      where: { guestId: guestId, isActive: true },
    });

    return result.map((a) => AddressMapper.toDomain(a));
  }
  async updateAddress(
    addressId: string,
    data: Omit<IAddress, "id" | "createdAt" | "updatedAt">
  ): Promise<IAddress> {
    const exist =await this.findById(addressId);
    if (!exist) throw new NotFoundError(ErrorMessages.ADDRESS_NOT_FOUND);
    const updated = await prisma.address.update({
      where: { id: addressId },
      data,
    });

    return AddressMapper.toDomain(updated);
  }
  async deleteAddress(addressId: string): Promise<void> {
    await prisma.address.update({
      where: { id: addressId },
      data: { isActive: false },
    });
  }
}
