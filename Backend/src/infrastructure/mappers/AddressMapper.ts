import { Address, Prisma } from "@prisma/client";
import { IAddress } from "../../domain/address/entities/IAddress";
import { AddressType } from "../../shared/Enums";

export class AddressMapper {
  static toDomain(data: Address): IAddress {
    return {
      id: data.id,
      fullName: data.fullName,
      city: data.city,
      country: data.country,
      guestId: data.guestId,
      landmark: data.landmark,
      phone: data.phone,
      state: data.state,
      street: data.street,
      type: data.type as AddressType,
      isDefault: data.isDefault,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      zipCode: data.zipCode,
    };
  }

  static toPersistance(
    data: Omit<IAddress, "id" | "createdAt" | "updatedAt">
  ): Prisma.AddressCreateInput {
    return {
      fullName: data.fullName,
      city: data.city,
      country: data.country,
      landmark: data.landmark,
      phone: data.phone,
      state: data.state,
      street: data.street,
      type: data.type,
      isDefault: data.isDefault,
      isActive: data.isActive,
      zipCode: data.zipCode,
      guest: { connect: { id: data.guestId } },
    };
  }
}
