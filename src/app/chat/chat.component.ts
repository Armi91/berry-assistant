import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Chat } from '../_models/chat';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [`
    :host {
      display: block;
      height: calc(100vh - 12rem);
    }
  `]
})
export class ChatComponent {
  chatId?: string;

  constructor(private route: ActivatedRoute, private chat: ChatService) {
    this.route.params.subscribe({
      next: params => {
        this.chatId = params['chatId'];
        if (this.chatId) {
          this.chat.getChat(this.chatId);
        }
      }
    })
  }
}
