import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { CustomChatComponent } from './custom-chat/custom-chat.component';
import { ImageGenerationComponent } from '../image-generation/image-generation.component';

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
    path: 'image-generation',
    component: ImageGenerationComponent
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
