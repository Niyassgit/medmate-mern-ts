export interface ConnectionRequestStatsDTO {
  used: number;
  limit: number | null;
  remaining: number | null;
  isSubscribed: boolean ;
}