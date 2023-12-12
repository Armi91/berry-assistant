import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/_models/chat';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input('message') message!: Message;
  constructor(private route: ActivatedRoute, protected chat: ChatService) {

  }
}
