import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageComponent } from './message/message.component';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { CustomChatComponent } from './custom-chat/custom-chat.component';
import { StreamedMessageComponent } from './message/streamed-message/streamed-message.component';


@NgModule({
  declarations: [
    ChatComponent,
    MessageListComponent,
    MessageComponent,
    CustomChatComponent,
    StreamedMessageComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ]
})
export class ChatModule { }
