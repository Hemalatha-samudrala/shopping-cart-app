import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent {

  confirmationCode: string = '';
  orderPlaced: boolean = false;

  // ✅ prevents double click / duplicate orders
  isPlacingOrder: boolean = false;

  constructor(
    public cartService: CartService,
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  placeOrder() {

  if (this.isPlacingOrder) return;

  this.isPlacingOrder = true;

  const userId = this.auth.getUserId();
  const items = this.cartService.cartItems();

  if (!userId || items.length === 0) {
    alert('Invalid order');
    this.isPlacingOrder = false;
    return;
  }

  this.http.post(`${environment.apiUrl}/api/orders`, {
    userId,
    items,
    totalPrice: this.cartService.getTotal()
  }).subscribe({
    next: (res: any) => {
      this.confirmationCode = res.orderCode;
      this.orderPlaced = true;
      this.cartService.clearCart(userId);
      this.isPlacingOrder = false;
    },
    error: () => {
      alert('Order failed');
      this.isPlacingOrder = false;
    }
  });
}

  goToProducts() {
    this.router.navigate(['/products']);
  }
}