import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { PromptComponent } from './prompt/prompt.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageComponent } from './message/message.component';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    ChatComponent,
    PromptComponent,
    MessageListComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ]
})
export class ChatModule { }
