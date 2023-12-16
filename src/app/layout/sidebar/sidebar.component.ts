import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
}
