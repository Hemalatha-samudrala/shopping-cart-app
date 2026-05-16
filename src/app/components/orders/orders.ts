import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { OrderService } from '../../services/order';
import { Order } from '../../models/order';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {

  // =====================
  // STATE
  // =====================
  env=environment;
  orders: Order[] = [];
  stats: any[] = [];
  userId!: number;
  isAdmin = false;
  expandedOrderId: number | null = null;

  // =====================
  // FILTERS
  // =====================
  statusFilter = '';
  dateFilter = '';
  orderCodeFilter = '';

  constructor(
    private auth: AuthService,
    private orderService: OrderService
  ) {}

  // =====================
  // INIT
  // =====================
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

  // =====================
  // LOAD USER ORDERS
  // =====================
  loadOrders() {

   this.orderService.getOrdersById(
  this.userId,
  this.statusFilter,
  this.dateFilter,
  this.orderCodeFilter
)
.subscribe({
  next: (res) => {
    this.orders = res.data;
  }
});
  }

  // =====================
  // UPDATE ORDER STATUS
  // =====================
  updateStatus(order: Order) {

    this.orderService
      .updateOrderStatus(
        order.id,
        order.status
      )
      .subscribe({

        next: () => {

          console.log('Status updated');
        },

        error: (err) => {

          console.error(err);

          alert('Failed to update status');
        }
      });
  }

  // =====================
  // ADMIN LOAD ORDERS
  // =====================
  loadAllOrders() {
    this.orderService.getOrders(
  this.statusFilter,
  this.dateFilter,
  this.orderCodeFilter
)
.subscribe({
  next: (res) => {
    this.orders = res.data;
  }
});
  }

  // =====================
  // LOAD STATS
  // =====================
  loadStats() {

    // future stats service
    console.log('Load stats');
  }

  // =====================
  // APPLY FILTERS
  // =====================
  applyFilters() {

    if (this.isAdmin) {

      this.loadAllOrders();

      this.loadStats();

    } else {

      this.loadOrders();
    }
  }

  // =====================
  // TOGGLE EXPAND
  // =====================
  toggleOrder(orderId: number) {

    this.expandedOrderId =
      this.expandedOrderId === orderId
        ? null
        : orderId;
  }
}