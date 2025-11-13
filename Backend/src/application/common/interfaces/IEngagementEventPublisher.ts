export interface IEngagementEventPublisher {
  publishLikeToggled(event: {
    productId: string;
    doctorId: string;
    liked: boolean;
    totalLikes: number;
  }): Promise<void>;
  
  publishInterestToggled(event: {
    productId: string;
    doctorId: string;
    interested: boolean;
    totalInterests: number;
  }): Promise<void>;
}
