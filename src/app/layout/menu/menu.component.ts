/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { ChatService } from 'src/app/_services/chat.service';

export interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string;
  items?: MenuItem[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [],
})
export class MenuComponent {
  model: any[] = [
    {
      label: 'Home',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: '/',
        },
        {
          label: 'Nowy chat',
          icon: 'pi pi-fw pi-plus',
          command: () => this.chat.newChat(),
        },
      ],
    },
    {
      label: 'Chaty',
      items: [
        {
          label: 'Lista',
          icon: 'pi pi-fw pi-list',
          routerLink: '/u/vision/list',
        },
        {
          label: 'Szablony',
          icon: 'pi pi-fw pi-book',
          routerLink: '/u/vision/templates',
        },
      ],
    },
  ];

  constructor(protected layoutService: LayoutService, private chat: ChatService) {}
}
