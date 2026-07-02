import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';
import { ApiResponse } from '../models/api-response';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl =
    `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  // =====================
  // PLACE ORDER
  // =====================
 
 placeOrder(data: any):Observable<ApiResponse<{ orderCode: string }>> {

  return this.http.post<
    ApiResponse<{ orderCode: string }>
  >(
    this.apiUrl,
    data
  );
}

  // =====================
  // GET USER ORDERS
  // =====================
  getOrders(
  status?: string,
  date?: string,
  orderCode?: string
): Observable<ApiResponse<Order[]>> {

  let params = new HttpParams();

  if (status) {
    params = params.set('status', status);
  }

  if (date) {
    params = params.set('date', date);
  }

  if (orderCode) {
    params = params.set('orderCode', orderCode);
  }

  return this.http.get<ApiResponse<Order[]>>(
    this.apiUrl,
    { params }
  );
}

  // =====================
  // GET ORDER BY ID
  // =====================
  getOrdersById(
  userId: number,
  status?: string,
  date?: string,
  orderCode?: string
): Observable<ApiResponse<Order[]>> {

  let params = new HttpParams();

  if (status) {
    params = params.set('status', status);
  }

  if (date) {
    params = params.set('date', date);
  }
  if (orderCode) {
    params = params.set('orderCode', orderCode);
  }

  return this.http.get<ApiResponse<Order[]>>(
    `${this.apiUrl}/user/${userId}`,
    { params }
  );
}

  // =====================
  // UPDATE ORDER STATUS
  // =====================
 updateOrderStatus(orderId: number, status: string) {
  return this.http.put(
    `${this.apiUrl}/${orderId}/status`,
    { status }
  );
}
// =====================
  // PRINT RECEIPT
  // =====================

printReceipt(orderId: number): void {
  this.http.get(
    `${this.apiUrl}/${orderId}/receipt`,
    {
      responseType: 'blob'
    }
  ).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  });
}

  // =====================
  // DELETE ORDER
  // =====================
  deleteOrder(id: number):
    Observable<ApiResponse<null>> {

    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${id}`
    );
  }
}