import { Timestamp } from "@angular/fire/firestore";

export interface Message {
  role: 'assistant' | 'system' | 'user' | 'tool' | 'function';
  content: string;
}

export interface Chat {
  uid: string;
  name: string;
  messages: Message[];
  chatId?: string;
  model: string;
  createdAt?: Timestamp;
  usage?: {
    completion_tokens?: number;
    prompt_tokens?: number;
    total_tokens?: number;
  }
}

