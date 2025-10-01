export interface ICertificate {
  id?: string;
  name: string;
  issuedBy?: string | null;
  year?: number | null;
}
