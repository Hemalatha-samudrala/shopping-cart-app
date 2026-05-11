import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {
  userId: number=0;
  constructor(
  public cartService: CartService,
  private auth: AuthService
) {}

  ngOnInit(): void {
    const id = this.auth.getUserId();
    console.log('UserId:', id)
  if (!id) {
    console.error('User not logged in');
    return;
  }

  this.userId = id;

  this.cartService.loadCart(this.userId);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(this.userId, productId);
  }

addOne(productId: number) {
  this.cartService.addToCart(this.userId, productId);
}

removeOne(productId: number) {
  this.cartService.decreaseQuantity(this.userId, productId);
}

  clearCart() {
    this.cartService.clearCart(this.userId);
  }

  getTotal() {
    return this.cartService.getTotal();
  }
}