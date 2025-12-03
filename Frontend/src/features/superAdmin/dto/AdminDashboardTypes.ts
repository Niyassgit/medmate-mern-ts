export interface StatsSummary {
  totalDoctors: number;
  totalReps: number;
  pendingValidations: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  expiringPlans: number;
  totalPosts: number;
  totalConnections: number;
  totalMessages: number;
}

export interface UserDistribution {
  doctors: number;
  reps: number;
}

export interface UserGrowth {
  months: string[];
  doctors: number[];
  reps: number[];
}

export interface RevenueByTier {
  tiers: string[];
  revenue: number[];
}

export interface Subscription {
  userId: string;
  name: string;
  tier: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
}