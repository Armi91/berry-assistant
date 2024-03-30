import { Component, Input } from '@angular/core';
import { Message } from 'src/app/_models/chat';
import { AuthService } from 'src/app/_services/auth.service';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input('message') message!: Message;
  constructor(protected chat: ChatService, protected auth: AuthService) {}
}
