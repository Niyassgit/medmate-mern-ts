export interface RepCardDetailsDTO {
  id: string;
  name: string;
  about: string;
  profileImage: string;
  companyName: string;
  territoryNames?: string[];
  subscriptionStatus?: boolean;
  connectionStatus: string | null;
  connectionInitiator: string | null;
}
