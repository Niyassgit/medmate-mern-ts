import { IProductPost } from "./IProductPost";

export interface IProductPostForFeed extends IProductPost {
  rep: {
    id: string;
    name: string;
    company: string;
    isSubscribedRep: boolean | null;
    image?: string | null;
  };
  _count: {
    likes?: number;
    interests?: number;
  };
}
