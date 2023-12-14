import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { CustomChatComponent } from './custom-chat/custom-chat.component';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent
  },
  {
    path: 'custom',
    component: CustomChatComponent
  },
  {
    path: ':chatId',
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
