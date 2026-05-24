import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { OrderService } from '../../services/order';
import { Order } from '../../models/order';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

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
      Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'Please login first'
    });
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
    this.orders = res.data.map(order => ({
        ...order,
        previousStatus: order.status
      }));
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
          Swal.fire({
          icon: 'success',
          title: 'Status updated!',
          timer: 1500,
          showConfirmButton: false
        });
        },

        error: (err) => {
           Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'Could not update status'
        });
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
    this.orders = res.data.map(order => ({
      ...order,
      previousStatus: order.status
    }));
  },

  error: (err) => {
    console.error(err);
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

onStatusChange(event: Event, order: any) {

  const select = event.target as HTMLSelectElement;
  const newStatus = select.value;

  // If cancelling order → show confirmation dialog
  if (newStatus === 'Cancelled') {

    Swal.fire({
      title: `Cancel Order ${order.orderCode}?`,
      text: "This action cannot be undone",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) {

        // revert dropdown
        select.value = order.status;
        return;
      }

      // proceed with cancellation
      order.previousStatus = order.status;
      order.status = newStatus;

      this.updateStatus(order);

      Swal.fire({
        icon: 'success',
        title: 'Order Cancelled',
        text: `Order ${order.orderCode} has been cancelled`,
        timer: 2000,
        showConfirmButton: false
      });
    });

    return; // important to stop execution
  }

  // normal status change (no confirmation needed)
  order.previousStatus = order.status;
  order.status = newStatus;

  this.updateStatus(order);

  Swal.fire({
    icon: 'success',
    title: 'Status Updated',
    text: `Order ${order.orderCode} updated to ${newStatus}`,
    timer: 1500,
    showConfirmButton: false
  });
}
}