import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  userId!: number;
  statusFilter: string = '';
dateFilter: string = '';
stats: any[] = [];
isAdmin = false;
expandedOrderId: number | null = null;
orderCodeFilter: string = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
  const id = this.auth.getUserId();

  if (!id) {
    alert('Please login');
    return;
  }

  this.userId = id;
  this.isAdmin = this.auth.isAdmin();

  this.applyFilters();
}

  loadOrders() {
      let url = `${environment.apiUrl}/orders/${this.userId}?`;

  if (this.statusFilter) url += `status=${this.statusFilter}&`;
  if (this.dateFilter) url += `date=${this.dateFilter}`;

  this.http.get<any[]>(url).subscribe(res => {this.orders = res;console.log(this.orders);});
  }
  updateStatus(order: any) {
  this.http.put(`${environment.apiUrl}/orders/${order.Id}/status`, {
    status: order.Status
  }).subscribe({
    next: () => {
      console.log('Status updated');
    },
    error: (err) => {
      console.error(err);
      alert('Failed to update status');
    }
  });
}

loadAllOrders() {
  let url = `${environment.apiUrl}/orders?`;
  
  if (this.orderCodeFilter) {
    url += `orderCode=${this.orderCodeFilter}&`;
  }
  if (this.statusFilter) url += `status=${this.statusFilter}&`;
  if (this.dateFilter) url += `date=${this.dateFilter}`;

  this.http.get<any[]>(url).subscribe(res => this.orders = res);
}

loadStats() {
  let url = `${environment.apiUrl}/orders/stats?`;

  if (this.statusFilter) {
    url += `status=${this.statusFilter}&`;
  }

  if (this.dateFilter) {
    url += `date=${this.dateFilter}`;
  }

  this.http.get<any[]>(url).subscribe({
    next: (res) => this.stats = res,
    error: (err) => console.error(err)
  });
}

applyFilters() {
  if (this.isAdmin) {
    this.loadAllOrders();
    this.loadStats();     //  admin
  } else {
    this.loadOrders();
  }
}
toggleOrder(orderId: number) {
  this.expandedOrderId =
    this.expandedOrderId === orderId ? null : orderId;
}

}