import { Component } from '@angular/core';
import { take } from 'rxjs';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styles: [],
})
export class PromptComponent {
  prompt: string = '';
  constructor(private chat: ChatService) {}


  send() {
    this.chat.currentChat$.pipe(
      take(1)
    ).subscribe({next: chat => {
      if (chat?.chatId) {
        this.chat.sendPrompt(this.prompt, chat.chatId);
      }
    }})
  }
}
