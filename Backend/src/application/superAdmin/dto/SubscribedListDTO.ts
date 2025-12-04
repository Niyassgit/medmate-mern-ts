export interface SubscribedListItem {
  userId: string;
  name: string;
  tier: string;
  amount: number;
  date: Date;
  status: string;
}

export interface SubscribedListResponse {
  subscriptions: SubscribedListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

