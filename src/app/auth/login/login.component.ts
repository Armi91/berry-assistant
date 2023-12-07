import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {
  loginForm = { email: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  login() {
    this.authService.loginWithEmail(this.loginForm);
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
