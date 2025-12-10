export interface GuestListDTO {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isBlocked: boolean | null;
  territory: string | null;
  createdAt: Date | null;
  loginId: string | null;
}

