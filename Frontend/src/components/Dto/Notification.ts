import { NotificationType } from "@/types/Types";

export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: Date;
  roleId: string;
  postId: string;
  postImage: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
}