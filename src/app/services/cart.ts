import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { CartItem } from '../models/cart-item';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // =====================
  // STATE
  // =====================
  cartItems = signal<CartItem[]>([]);

  private apiUrl = `${environment.apiUrl}/api/cart`;

  constructor(private http: HttpClient) {}

  // =====================
  // LOAD CART
  // =====================
  loadCart() {
  return this.http
    .get<ApiResponse<CartItem[]>>(this.apiUrl)
    .pipe(
      tap(res => {
        this.cartItems.set(res.data);
      })
    );
}


  // =====================
  // ADD TO CART
  // =====================
  addToCart(productId: number, quantity: number = 1) {

  return this.http.post<ApiResponse<CartItem[]>>(
    `${this.apiUrl}`,
    { productId, quantity }
  ).pipe(
    tap(() => {
      // reload full cart after update
      this.loadCart().subscribe();
    })
  );
}

  // =====================
  // REMOVE ITEM
  // =====================
  removeFromCart(productId: number) {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${productId}`
    );
  }

  // =====================
  // DECREASE QUANTITY
  // =====================
  decreaseQuantity(productId: number) {
    return this.http.put<ApiResponse<null>>(
      `${this.apiUrl}/${productId}`,
      {}
    );
  }

  // =====================
  // CLEAR CART
  // =====================
  clearCart() {
    return this.http.delete<ApiResponse<null>>(
      this.apiUrl
    );
  }

  // =====================
  // TOTAL ITEMS
  // =====================
  totalItems(): number {
    return this.cartItems().reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  // =====================
  // TOTAL PRICE
  // =====================
  getTotal(): number {
    return this.cartItems().reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  }
}