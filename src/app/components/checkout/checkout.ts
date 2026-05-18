import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { finalize,timeout } from 'rxjs/operators';
import { Router } from '@angular/router';

import { CartService } from '../../services/cart';

import { AuthService } from '../../services/auth';

import { OrderService } from '../../services/order';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent {

  confirmationCode = '';

  orderPlaced = false;

  isPlacingOrder = false;

  env = environment;

  constructor(
    public cartService: CartService,
    private auth: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  placeOrder() {

  if (this.isPlacingOrder) return;

  const userId =
    this.auth.getUserId();

  const items =
    this.cartService.cartItems();

  if (!userId || !items.length) {

    alert('Cart is empty');
    return;
  }

  this.isPlacingOrder = true;

  const orderItems = items.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }));

    this.orderService.placeOrder({
    userId,
    items: orderItems})
.pipe(
  finalize(() => {
    this.isPlacingOrder = false;
  })
)
.subscribe({
  next: (res) => {
    this.confirmationCode = res.data.orderCode;
    this.orderPlaced = true;
    this.cartService.cartItems.set([]);
  },
  error: (err) => {
    console.error(err);
    alert(err.error?.message || 'Order failed');
  }
});
  
}

isCartValid(): boolean {

  return this.cartService.cartItems().every(item =>
    item.quantity <= (item.stock ?? 0)
  );
}
  goToProducts() {

    this.router.navigate(['/products']);
  }
}