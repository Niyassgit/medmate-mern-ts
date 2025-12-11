export interface RegisterGuestDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  territoryId?: string;
  shareToken?:string;
}

