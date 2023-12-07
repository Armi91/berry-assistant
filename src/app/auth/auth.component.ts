import { Component } from '@angular/core';
import { LayoutService } from '../layout/services/layout.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: [],
  providers: [MessageService],
})
export class AuthComponent {
  password?: string;
  constructor(protected layoutService: LayoutService) {}
}
