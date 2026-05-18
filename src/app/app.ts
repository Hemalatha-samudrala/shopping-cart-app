import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner';
import { AuthService } from './services/auth';
import { CartService } from './services/cart';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule,LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  constructor(
    public auth: AuthService,
    public cartService: CartService,
    public router: Router
  ) {}

  logout() {
    this.auth.logout();
    this.cartService.cartItems.set([]);
    this.router.navigate(['/']);
  }

  isLoginPage(): boolean {
    return this.router.url === '/';
  }
}