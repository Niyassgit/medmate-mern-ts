export interface NetworkResponseDTO {
  id: string;
  name: string;
  profileImage?: string | null;
  about?: string | null;
  companyName: string;
  connectionStatus:string | null;
  connectionInitiator:string | null;
}
