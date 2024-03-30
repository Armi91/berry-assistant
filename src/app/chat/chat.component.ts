import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Chat } from '../_models/chat';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
    `
      :host {
        display: block;
        height: calc(100vh - 9rem);
      }
    `,
  ],
})
export class ChatComponent {
  @ViewChild('scrollWindow') scrollWindow?: ElementRef;
  chatId?: string;
  isSending$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  clearPrompt$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  streamedMessage$ = new BehaviorSubject({ content: '', streaming: false });

  constructor(private route: ActivatedRoute, private chat: ChatService) {
    this.route.params.subscribe({
      next: (params) => {
        this.chatId = params['chatId'];
        if (this.chatId) {
          this.chat.getChat(this.chatId);
        }
      },
    });
  }

  send(prompt: string) {
    let messageContent = '';
    this.chat.sendPrompt(prompt, this.chatId!).subscribe({
      next: (data: any) => {
        if (data?.delta?.content && typeof data.delta.content === 'string') {
          messageContent += data.delta.content;
          this.streamedMessage$.next({
            content: messageContent,
            streaming: true,
          });
          if (this.isScrolledToBottom()) {
            this.scrollWindow?.nativeElement.scrollTo({
              top: this.scrollWindow.nativeElement.scrollHeight,
              behavior: 'smooth',
            });
          }
        }
      },
      error: (error) => {
        console.error(error);
        this.isSending$.next(false);
      },
      complete: () => {
        this.streamedMessage$.next({
          content: messageContent,
          streaming: false,
        });
        this.chat.updateMessagesList({
          content: messageContent,
          role: 'assistant',
        });
        this.chat.updateChatName(this.chatId!, prompt, messageContent);
        this.isSending$.next(false);
        this.clearPrompt$.next(true);
        this.clearPrompt$.next(false);
      },
    });
  }

  updateChatName(chat: Chat, prompt: string, answer: string) {
    if (chat.messages.length > 1 && chat.messages.length <= 3) {
      this.chat.updateChatName(chat.chatId!, prompt, answer);
    }
  }

  private isScrolledToBottom() {
    if (this.scrollWindow) {
      const element = this.scrollWindow.nativeElement;
      return (
        element.scrollHeight - (element.scrollTop + element.clientHeight) <= 50
      );
    }
    return false;
  }
}
