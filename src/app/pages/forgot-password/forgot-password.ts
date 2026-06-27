import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPasswordComponent {

  email = '';
  message = '';

  constructor(
    private authService: AuthService
  ) {}

  submit() {

    this.authService
      .forgotPassword(this.email)
      .subscribe({
        next: () => {
          this.message =
            'Password reset link sent';
        },
        error: () => {
          this.message =
            'Unable to send reset link';
        }
      });
  }
}