import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Chat } from '../_models/chat';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [`
    :host {
      display: block;
      height: calc(100vh - 9rem);
    }
  `]
})
export class ChatComponent {
  // TODO: delete empty chats
  chatId?: string;
  isSending$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  clearPrompt$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private route: ActivatedRoute, private chat: ChatService) {
    this.route.params.subscribe({
      next: params => {
        this.chatId = params['chatId'];
        if (this.chatId) {
          this.chat.getChat(this.chatId);
        }
      }
    })

    // this.chat.getModelsList();

  }

  send(prompt: string) {
    this.chat.currentChat$.pipe(take(1)).subscribe({
      next: (chat) => {
        if (chat?.chatId) {
          this.updateChatName(chat, prompt);
          this.chat.sendPrompt(prompt, chat.chatId, chat.model).then(() => {
            this.isSending$.next(false);
            this.clearPrompt$.next(true);
            this.clearPrompt$.next(false);
          }).catch(() => {
            this.isSending$.next(false);
          })
        }
      },
    });
  }

  updateChatName(chat: Chat, prompt: string) {
    if (chat.messages.length === 1) {
      this.chat.updateChatName(chat.chatId!, prompt);
    }
  }
}
