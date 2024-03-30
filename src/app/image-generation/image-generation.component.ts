import { Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImagesService } from '../_services/images.service';
import { autoId } from '../_helpers/autoID';
import { ToastrService } from 'ngx-toastr';
import { Image } from 'primeng/image';

@Component({
  selector: 'app-image-generation',
  templateUrl: './image-generation.component.html',
  styles: [],
})
export class ImageGenerationComponent {
  isSending$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  clearPrompt$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  imagePreview?: string;
  myPrompt?: string;
  revisedPrompt?: string;

  @ViewChild('imagePrev') imagePrev?: Image;

  constructor(
    protected imagesService: ImagesService,
    private toastr: ToastrService
  ) {}

  send(prompt: string) {
    this.imagesService.sendDallePrompt(prompt).then((response) => {
      this.isSending$.next(false);
      const data = response?.data as any;
      const image = data?.image;
      if (image) {
        this.imagePreview = `data:image/png;base64,${image.data[0].b64_json}`;
        this.myPrompt = prompt;
        this.revisedPrompt = image.data[0].revised_prompt;
      }
    });
  }

  saveToDatabase() {
    const blob = this.getImageAsFile();
    if (!blob) {
      this.toastr.error('Nie udało się zapisać obrazka', 'Wystąpił błąd');
      return;
    }
    if (!this.myPrompt || !this.revisedPrompt) {
      this.toastr.error('Prompt nie może być pusty', 'Wystąpił błąd');
      return;
    }

    const name = autoId();
    this.imagesService.saveImageToStorage(
      blob,
      name,
      this.myPrompt,
      this.revisedPrompt
    );
  }

  getImageAsFile(): Blob | undefined {
    if (!this.imagePreview) {
      return;
    }
    const blobBin = atob(this.imagePreview.split(',')[1]);
    const ab = new ArrayBuffer(blobBin.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < blobBin.length; i++) {
      ia[i] = blobBin.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }
}
