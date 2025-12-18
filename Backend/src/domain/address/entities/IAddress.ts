import { AddressType } from "../../../shared/Enums";

export interface IAddress{
     id: string;
      guestId: string;
      type: AddressType;
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      landmark: string | null;
      isDefault: boolean;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
}