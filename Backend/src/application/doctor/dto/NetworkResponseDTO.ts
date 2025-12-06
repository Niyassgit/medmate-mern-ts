export interface NetworkResponseDTO {
  id: string;
  name: string;
  profileImage?: string | null;
  about?: string | null;
  companyName: string;
  territoryNames?: string[];
  subscriptionStatus?: boolean;
  connectionStatus:string | null;
  connectionInitiator:string | null;
}
