import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { ApiResponse } from '../models/api-response';

import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // =====================
  // STATE
  // =====================
  cartItems = signal<CartItem[]>([]);
 

  private apiUrl =
    `${environment.apiUrl}/api/cart`;

  constructor(private http: HttpClient) {}

  // =====================
  // LOAD CART
  // =====================
  loadCart(userId: number) {
    
    return this.http.get<ApiResponse<CartItem[]>>(
      `${this.apiUrl}/${userId}`
    );
  }

  // =====================
  // ADD TO CART
  // =====================
  addToCart(
    userId: number,
    productId: number
  ) {
    return this.http.post<ApiResponse<null>>(
      this.apiUrl,
      {
        userId,
        productId
      }
    );
  }

  // =====================
  // REMOVE FROM CART
  // =====================
  removeFromCart(
    userId: number,
    productId: number
  ) {
  
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${userId}/${productId}`
    );
  }

  // =====================
  // DECREASE QUANTITY
  // =====================
  decreaseQuantity(
    userId: number,
    productId: number
  ) {

    return this.http.put<ApiResponse<null>>(
      `${this.apiUrl}/${userId}/${productId}`,
      {}
    );
  }

  // =====================
  // CLEAR CART
  // =====================
  clearCart(userId: number) {
    
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${userId}`
    );
  }

  // =====================
  // TOTAL ITEMS
  // =====================
  totalItems(): number {
    return this.cartItems().reduce(

      (sum, item) =>

        sum + item.quantity,

      0
    );
  }

  // =====================
  // TOTAL PRICE
  // =====================
  getTotal(): number {

    return this.cartItems().reduce(
      (sum, item) =>
        sum + (item.price * item.quantity),
      0
    );
  }

  
}