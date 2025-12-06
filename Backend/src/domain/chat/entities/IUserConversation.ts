export interface IUserConversation {
  id: string;
  name: string;
  profileImage: string | null;
  lastMessage?: string;
  lastMessageAt?: Date;
  unread: number;
  repId: string;
  doctorId: string;
  repUserId: string | null;
  doctorUserId: string | null;
  lastMessageIsRead: boolean;
  senderId: string;
}
