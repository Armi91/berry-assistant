import { Component } from '@angular/core';
import { take } from 'rxjs';
import { Chat } from 'src/app/_models/chat';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styles: [
    `
      .pi-send {
        transition: color 0.1s ease-in-out;
        top: auto;
        bottom: 1.2rem;
        &:hover {
          color: var(--primary-color);
        }
      }
      .spinner {
        position: absolute;
        bottom: 1.2rem;
        right: 1rem;
      }
    `,
  ],
})
export class PromptComponent {
  prompt: string = '';
  isSending: boolean = false;
  constructor(private chat: ChatService) {}

  send(event: KeyboardEvent | null = null) {
    if (event) {
      event.preventDefault();
    }
    if (!this.prompt) {
      return;
    }
    this.isSending = true;
    this.chat.currentChat$.pipe(take(1)).subscribe({
      next: (chat) => {
        if (chat?.chatId) {
          this.checkIfUpdateChatName(chat);
          this.chat.sendPrompt(this.prompt, chat.chatId, chat.model).then(() => {
            this.isSending = false;
            this.prompt = '';
          }).catch(() => {
            this.isSending = false;
          })
        }
      },
    });
  }

  checkIfUpdateChatName(chat: Chat) {
    if (chat.messages.length === 1) {
      this.chat.updateChatName(chat.chatId!, this.prompt);
    }
  }
}
