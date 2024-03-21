import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { SliderModule } from 'primeng/slider';
import { ImageModule } from 'primeng/image';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { PromptComponent } from './prompt/prompt.component';
import { FileUploadComponent } from './prompt/file-upload/file-upload.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [PromptComponent, FileUploadComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    CardModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    DropdownModule,
    BadgeModule,
    SliderModule,
    ProgressBarModule,
    ImageModule,
    AccordionModule,
    FileUploadModule,
    TooltipModule,
  ],
  exports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    CardModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    DropdownModule,
    BadgeModule,
    SliderModule,
    PromptComponent,
    ProgressBarModule,
    ImageModule,
    AccordionModule,
    FileUploadModule,
    TooltipModule,
  ],
})
export class SharedModule {}
