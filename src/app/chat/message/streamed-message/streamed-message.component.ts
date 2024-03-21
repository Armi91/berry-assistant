import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MessageComponent } from '../message.component';
import { ChatService } from 'src/app/_services/chat.service';
import { AuthService } from 'src/app/_services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-streamed-message',
  templateUrl: './streamed-message.component.html',
  styles: [],
})
export class StreamedMessageComponent extends MessageComponent {
  @Input('streamedMessage') streamedMessage$!: BehaviorSubject<{
    content: string;
    streaming: boolean;
  }>;

  constructor(
    chat: ChatService,
    auth: AuthService,
    private cd: ChangeDetectorRef
  ) {
    super(chat, auth);
  }
}
