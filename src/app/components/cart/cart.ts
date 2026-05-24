import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { CartService } from '../../services/cart';

import { AuthService } from '../../services/auth';

import { CartItem } from '../../models/cart-item';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

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
      Swal.fire({
  icon: 'warning',
  title: 'Login Required',
  text: 'Please login first',
  confirmButtonColor: '#3085d6'
});

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
           Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'Could not load cart'
        });
          
        }
      });
  }

  // =====================
  // REMOVE ITEM
  // =====================
  removeItem(productId: number) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This item will be removed from cart',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33'
      }).then((result) => {
    
        if (result.isConfirmed) {
        this.cartService
      .removeFromCart(
        this.userId,
        productId
      ).subscribe({next: () => {
          Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              timer: 1500,
              showConfirmButton: false
            });
    
          this.loadCart();
        },
        error: (err) => {
           Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'Could not remove item'
        });
        }
      });
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

           Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'Could not increase the count'
        });
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

           Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'Could not decrease the count'
        });
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