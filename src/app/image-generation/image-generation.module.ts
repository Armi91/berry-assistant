import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageGenerationComponent } from './image-generation.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ImageGenerationComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ImageGenerationModule { }
