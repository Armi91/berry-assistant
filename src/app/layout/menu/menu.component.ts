/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { ChatService } from 'src/app/_services/chat.service';
import { Timestamp } from '@angular/fire/firestore';

export interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string;
  items?: MenuItem[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [``],
})
export class MenuComponent implements OnInit {
  model: any[] = [
    {
      label: 'Menu',
      items: [
        {
          label: 'GPT-3.5 Turbo',
          icon: 'pi pi-fw pi-plus',
          command: () => this.chat.newChat('gpt-3.5-turbo'),
        },
        {
          label: 'GPT-4',
          icon: 'pi pi-fw pi-plus',
          command: () => this.chat.newChat('gpt-4'),
        },
        {
          label: 'GPT-4 Turbo',
          icon: 'pi pi-fw pi-plus',
          command: () => this.chat.newChat('gpt-4-turbo-preview'),
        },
        {
          label: 'Custom chat',
          icon: 'pi pi-fw pi-cog',
          routerLink: '/u/chat/custom',
        },
        {
          label: 'Dall-e 3',
          icon: 'pi pi-fw pi-image',
          routerLink: '/u/images/image-generation',
        },
        {
          label: 'Zapisane obrazy',
          icon: 'pi pi-fw pi-image',
          routerLink: '/u/images',
        },
      ],
    },
    {
      label: 'Czaty',
      items: [],
    },
  ];

  constructor(
    protected layoutService: LayoutService,
    private chat: ChatService
  ) {}

  ngOnInit(): void {
    this.chat.getChatsList().subscribe({
      next: (chats) => {
        const chatsHistory: any[] = [];
        chats.forEach((chatData) => {
          chatsHistory.push({
            label: chatData['name'],
            icon: 'pi pi-fw pi-comments',
            routerLink: `/u/chat/${chatData['chatId']}`,
            isChat: true,
            chatId: chatData['chatId'],
            createdAt: chatData['createdAt'],
          });
        });
        this.model[1].items = chatsHistory.sort((a, b) => {
          return (
            (b.createdAt as Timestamp).seconds -
            (a.createdAt as Timestamp).seconds
          );
        });
      },
    });
  }
}
