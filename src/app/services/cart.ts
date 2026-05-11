import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  // LOAD CART
  loadCart(userId: number) {
    this.http.get<any[]>(`${environment.apiUrl}/cart/${userId}`)
      .subscribe({
        next: (res) => {
          this.cartItems.set(res);
        },
        error: (err) => {
          console.error('Failed to load cart', err);
        }
      });
  }

  // ADD TO CART
  addToCart(userId: number, productId: number) {
    this.http.post(`${environment.apiUrl}/cart`, {
      userId,
      productId
    }).subscribe({
      next: () => {
        this.loadCart(userId);
      },
      error: (err) => {
        console.error('Add to cart failed', err);
      }
    });
  }

  // REMOVE ITEM
  removeFromCart(userId: number, productId: number) {
    this.http.delete(`${environment.apiUrl}/cart/${userId}/${productId}`)
      .subscribe({
        next: () => {
          this.loadCart(userId);
        },
        error: (err) => {
          console.error('Remove failed', err);
        }
      });
  }
//DECREASE QUANTITY
  decreaseQuantity(userId: number, productId: number) {
  this.http.put(
    `${environment.apiUrl}/cart/${userId}/${productId}`,
    {}
  ).subscribe(() => {
    this.loadCart(userId);
  });
}

  // CLEAR CART
  clearCart(userId: number) {
    this.http.delete(`${environment.apiUrl}/cart/${userId}`)
      .subscribe({
        next: () => {
          this.cartItems.set([]);
        },
        error: (err) => {
          console.error('Clear cart failed', err);
        }
      });
  }

  // TOTAL ITEMS
  totalItems() {
    return this.cartItems().reduce(
      (sum, item) => sum + item.Quantity,
      0
    );
  }

  // TOTAL PRICE
  getTotal() {
    return this.cartItems().reduce(
      (sum, item) => sum + (item.Price * item.Quantity),
      0
    );
  }
}