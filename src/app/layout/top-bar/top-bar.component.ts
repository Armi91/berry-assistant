import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styles: [],
})
export class TopBarComponent {
  items!: MenuItem[];
  @ViewChild('menuButton') menuButton!: ElementRef;
  @ViewChild('topBarMenuButton') topBarMenuButton!: ElementRef;
  @ViewChild('topBarMenu') topBarMenu!: ElementRef;

  constructor(protected layoutService: LayoutService) {}
}
