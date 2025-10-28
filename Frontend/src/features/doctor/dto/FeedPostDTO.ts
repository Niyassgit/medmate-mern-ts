import { RepInfo } from "./RepInfoForPostDTO";

export interface FeedPostDTO{
    id: string;
  title: string;
  image: string;
  likes: number;
  interests: number;
  useCases: string[];
  rep: RepInfo;
  createdAt: string;
}