export interface Conversation {
  id: string;
  name: string;
  profilImage: string;
  lastMessage: string | null;
  lastMessageAt: string;
  unread: number;
  senderId: string;
  receiverId: string;
  repId:string;
  doctorId:string;
  lastMessageIsRead:boolean;
}
