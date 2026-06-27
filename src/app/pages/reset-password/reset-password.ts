import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.html'
})
export class ResetPasswordComponent {

  password = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  submit() {

    const token =
      this.route.snapshot
        .queryParamMap
        .get('token');

    if (!token) {
      this.message =
        'Invalid reset link';
      return;
    }

    this.authService
      .resetPassword(
        token,
        this.password
      )
      .subscribe({
        next: () => {
          this.message =
            'Password reset successful';
        },
        error: () => {
          this.message =
            'Password reset failed';
        }
      });
  }
}