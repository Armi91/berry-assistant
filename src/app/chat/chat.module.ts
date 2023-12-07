import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { PromptComponent } from './prompt/prompt.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageComponent } from './message/message.component';


@NgModule({
  declarations: [
    ChatComponent,
    PromptComponent,
    MessageListComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
