import { IAddress } from "../../../domain/address/entities/IAddress";
import { AddressDTO } from "../dto/AddressDTO";

export class AddressMapper {
  static toDomain(data: IAddress): AddressDTO {
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
      type: data.type,
      zipCode: data.zipCode,
    };
  }

  static toEntity(
    dto: AddressDTO,
    guestId:string,
  ): Omit<IAddress, "id" | "createdAt" | "updatedAt"> {
    return {
      fullName: dto.fullName,
      city: dto.city,
      country: dto.country,
      guestId: guestId,
      landmark: dto.landmark,
      phone: dto.phone,
      state: dto.state,
      street: dto.street,
      type: dto.type,
      zipCode: dto.zipCode,
      isActive:true,
      isDefault:false,
    };
  }
}
