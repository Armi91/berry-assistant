export interface Message {
  role: 'assistant' | 'system' | 'user' | 'tool' | 'function';
  content: string;
}

export interface Chat {
  uid: string;
  name: string;
  messages: Message[];
  chatId?: string;
  usage?: {
    completion_tokens?: number;
    prompt_tokens?: number;
    total_tokens?: number;
  }
}

