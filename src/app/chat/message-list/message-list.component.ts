import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Message } from 'src/app/_models/chat';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styles: [],
})
export class MessageListComponent {
  @Input('scrollWindow') scrollWindow?: HTMLElement;
  @Input('streamedMessage') streamedMessage$!: BehaviorSubject<{
    content: string;
    streaming: boolean;
  }>;
  chatId?: string;
  messages$: Observable<Message[] | undefined>;

  constructor(private route: ActivatedRoute, protected chat: ChatService) {
    this.messages$ = this.chat.currentChat$.pipe(
      map((chat) => chat?.messages),
      tap(() => {
        setTimeout(() => {
          if (this.scrollWindow) {
            this.scrollWindow.scrollTo({
              top: this.scrollWindow.scrollHeight,
              behavior: 'smooth',
            });
          }
        }, 1);
      })
    );
  }
}
