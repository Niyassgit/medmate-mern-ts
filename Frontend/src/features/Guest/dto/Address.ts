import { AddressType } from "@/types/AddressType";

export interface AddressDTO {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string; 
  country: string;
  landmark?: string;
  type: AddressType;
}