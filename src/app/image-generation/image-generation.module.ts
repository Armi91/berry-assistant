import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageGenerationComponent } from './image-generation.component';
import { SharedModule } from '../shared/shared.module';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageGenerationRoutingModule } from './image-generation-routing.module';

@NgModule({
  declarations: [ImageGenerationComponent, ImageListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ImageGenerationRoutingModule
  ]
})
export class ImageGenerationModule { }
