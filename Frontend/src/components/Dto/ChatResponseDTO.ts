import { MessageDTO } from "./MessageDTO";

export interface ChatResponseDTO {
  messages: MessageDTO[];
  nextCursor: string | null;
}


