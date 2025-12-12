import { AddressType } from "../../../shared/Enums";

export interface AddressDTO {
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
  landmark: string;
}
