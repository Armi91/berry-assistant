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
  temperature?: number; // 0.0 - 2.0
  top_p?: number; // 0.0 - 1.0
  usage?: {
    completion_tokens?: number;
    prompt_tokens?: number;
    total_tokens?: number;
  }
}

