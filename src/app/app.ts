import { Component, effect } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner';
import { AuthService } from './services/auth';
import { CartService } from './services/cart';
import { ProductService } from './services/product';
import { CategoryService } from './services/category';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule,LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  private initialized = false;

  constructor(
    public auth: AuthService,
    public cartService: CartService,
    public productService: ProductService,
    public categoryService: CategoryService,
    public router: Router
  ) {

    // 🔥 React to login state globally
    effect(() => {

  console.log('LOGIN STATE:', this.auth.token());
      console.log("loggin",this.auth.isLoggedIn())
  if (this.auth.isLoggedIn() && !this.initialized) {

    this.initialized = true;

    this.cartService.loadCart().subscribe();
    this.productService.getProducts(null, '', 8).subscribe();
    this.categoryService.getAll().subscribe();
  }
});
  }

  logout() {
    this.auth.logout();
    this.cartService.cartItems.set([]);
    this.initialized = false;
    this.router.navigate(['/']);
  }

  isLoginPage(): boolean {
    return this.router.url === '/';
  }
}