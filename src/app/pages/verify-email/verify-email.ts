import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  templateUrl: './verify-email.html'
})
export class VerifyEmailComponent
  implements OnInit {

  message = 'Verifying email...';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const token =
      this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = 'Invalid verification link';
      return;
    }

    this.authService
      .verifyEmail(token)
      .subscribe({
        next: () => {
          this.message =
            'Email verified successfully';
        },
        error: () => {
          this.message =
            'Verification failed';
        }
      });
  }
}