import { z } from "zod";
import { Role } from "../../../shared/Enums";

export const SendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  receiverId: z.string().min(1, "Receiver ID is required"),
  senderRole: z.nativeEnum(Role),
  messageType: z.enum(["TEXT", "IMAGE", "AUDIO", "VIDEO", "FILE"]),
  content: z.string().nullable(), 
});

export type SendMessageDTO = z.infer<typeof SendMessageSchema>;
