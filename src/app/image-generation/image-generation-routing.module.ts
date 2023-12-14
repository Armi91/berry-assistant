import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageGenerationComponent } from '../image-generation/image-generation.component';
import { ImageListComponent } from './image-list/image-list.component';

const routes: Routes = [
  {
    path: '',
    component: ImageListComponent
  },
  {
    path: 'image-generation',
    component: ImageGenerationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageGenerationRoutingModule { }
