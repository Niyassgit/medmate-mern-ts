export interface IRecentSubscriptionPrisma {
  repId: string;
  amount: number;
  createdAt: Date;
  status: string;
  plan?: { name: string | null } | null;
  rep?: { name: string | null } | null;
}
