export interface ConversationDTO{
    id:string;
    name:string;
    profilImage:string | null;
    lastMessage?:string;
    lastMessageAt?:Date;
    unread:number;
}