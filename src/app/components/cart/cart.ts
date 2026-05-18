import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { CartService } from '../../services/cart';

import { AuthService } from '../../services/auth';

import { CartItem } from '../../models/cart-item';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {

  userId = 0;
  env=environment;

  constructor(
    public cartService: CartService,
    private auth: AuthService
  ) {}

  // =====================
  // INIT
  // =====================
  ngOnInit(): void {

    const id = this.auth.getUserId();

    if (!id) {

      console.error('User not logged in');

      return;
    }

    this.userId = id;

    this.loadCart();
  }

  // =====================
  // LOAD CART
  // =====================
  loadCart(): void {

    this.cartService
      .loadCart(this.userId)
      .subscribe({

        next: (res) => {

          this.cartService.cartItems
            .set(res.data);
             
        },

        error: (err) => {
          console.error(
            'Failed to load cart',
            err
          );
          
        }
      });
  }

  // =====================
  // REMOVE ITEM
  // =====================
  removeItem(productId: number): void {

    this.cartService
      .removeFromCart(
        this.userId,
        productId
      )
      .subscribe({

        next: () => {

          this.loadCart();
        },

        error: (err) => {

          console.error(
            'Remove failed',
            err
          );
        }
      });
  }

  // =====================
  // ADD QUANTITY
  // =====================
  addOne(productId: number): void {

    this.cartService
      .addToCart(
        this.userId,
        productId
      )
      .subscribe({

        next: () => {

          this.loadCart();
        },

        error: (err) => {

          console.error(
            'Add failed',
            err
          );
        }
      });
  }

  // =====================
  // REMOVE QUANTITY
  // =====================
  removeOne(productId: number): void {

    this.cartService
      .decreaseQuantity(
        this.userId,
        productId
      )
      .subscribe({

        next: () => {

          this.loadCart();
        },

        error: (err) => {

          console.error(
            'Decrease failed',
            err
          );
        }
      });
  }

  // =====================
  // CLEAR CART
  // =====================
  clearCart(): void {

    this.cartService
      .clearCart(this.userId)
      .subscribe({

        next: () => {

          this.cartService.cartItems.set([]);
        },

        error: (err) => {

          console.error(
            'Clear cart failed',
            err
          );
        }
      });
  }

  // =====================
  // TOTAL
  // =====================
  getTotal(): number {

    return this.cartService.getTotal();
  }

  // =====================
  // CART ITEMS
  // =====================
  get cartItems(): CartItem[] {

    return this.cartService.cartItems();
  }


}