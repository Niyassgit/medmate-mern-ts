import { AddressType } from "@/types/AddressType";

export interface AddressCreateDTO {
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