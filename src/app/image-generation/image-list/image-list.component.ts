import { Component, OnInit } from '@angular/core';
import { GeneratedImage } from 'src/app/_models/GeneratedImage';
import { ImagesService } from 'src/app/_services/images.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styles: [
  ]
})
export class ImageListComponent implements OnInit {

  images?: Promise<GeneratedImage[]>;

  constructor(private imagesService: ImagesService) { }

  ngOnInit(): void {
    this.images = this.imagesService.getSavedImages();
  }

  download(url: string, name: string) {
    const a = document.createElement('a');
    a.setAttribute('style', 'display: none');
    a.setAttribute('href', url);
    a.setAttribute('download', `${name}.png`);
    a.setAttribute('target', '_blank');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
