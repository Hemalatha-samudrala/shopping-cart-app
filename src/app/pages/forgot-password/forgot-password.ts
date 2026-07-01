import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

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
             Swal.fire({
          icon: 'success',
          title: 'reset link!',
          text: 'sent link successfully',
          timer: 1500,
          showConfirmButton: false
        });
        },
        error: (err) => {
          this.message =
            'Unable to send reset link';
             Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'failed to send link'
        });
        }
      });
  }
}