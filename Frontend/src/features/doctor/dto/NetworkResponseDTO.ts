export interface NetworkResponseDTO {
  id: string;
  name: string;
  profileImage?: string | null;
  about?: string | null;
  companyName: string;
  connectionStatus: string | null;
  territoryNames?: string[];
  connectionInitiator: string | null;
}
