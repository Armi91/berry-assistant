import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Message } from 'src/app/_models/chat';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styles: [
  ]
})
export class MessageListComponent {
  chatId?: string;
  messages$: Observable<Message[] | undefined>;

  constructor(private route: ActivatedRoute, protected chat: ChatService) {
    this.messages$ = this.chat.currentChat$.pipe(
      map(chat => chat?.messages)
    )
  }

}
