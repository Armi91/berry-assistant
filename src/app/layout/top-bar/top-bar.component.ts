import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../services/layout.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styles: [],
})
export class TopBarComponent {

  items!: MenuItem[];
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topBarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService, private auth: AuthService) {}

  signOut() {
    this.auth.signOut();
  }
}
