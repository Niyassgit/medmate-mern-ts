import { AddressDTO } from "../dto/AddressDTO";

export interface IGetAllAddressUseCase{
    execute(userId?:string):Promise<AddressDTO[]>;
  
}