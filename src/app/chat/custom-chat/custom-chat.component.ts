import { Component } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { autoId } from 'src/app/_helpers/autoID';
import { Chat } from 'src/app/_models/chat';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-custom-chat',
  templateUrl: './custom-chat.component.html',
  styles: [],
})
export class CustomChatComponent {
  models = [
    {
      name: 'gpt-3.5-turbo',
      type: 'text',
    },
    {
      name: 'gpt-4',
      type: 'text',
    },
    {
      name: 'gpt-4-turbo-preview',
      type: 'text',
    },
  ];

  chatData: Chat = {
    model: '',
    name: 'Custom chat',
    uid: '',
    top_p: 1,
    temperature: 1,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
    ],
    usage: {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0,
    },
  };

  constructor(private chat: ChatService) {}

  async createChat() {
    this.chat.newCustomChat(this.chatData);
  }
}
