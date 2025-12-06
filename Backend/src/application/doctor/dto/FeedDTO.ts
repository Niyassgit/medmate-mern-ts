export interface FeedDTO {
  id: string;
  title: string;
  image: string | null;
  useCases: string[];
  createdAt: Date;
  likes: number;
  interests: number;
  rep: {
    id: string;
    name: string;
    company: string;
    isSubscribedRep: boolean | null;
    ProfileImage?: string | null;
  };
}
