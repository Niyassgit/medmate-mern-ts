export interface SubHistoryDTO {
  id: string;
  repId: string;
  planId: string;
  sessionId: string;
  paymentIntentId: string | null;
  invoiceId: string | null;
  amount: number;
  currency: string;
  status: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

