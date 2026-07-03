import { Component, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { OrderService } from '../../services/order';
import { Order } from '../../models/order';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule,LoadingSpinnerComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {

  // =====================
  // STATE
  // =====================
  env=environment;
  orders = signal<Order[]>([]);
  stats: any[] = [];
  userId!: number;
  isAdmin = false;
  expandedOrderId: number | null = null;
  loading: boolean = false;
  // =====================
  // FILTERS
  // =====================
  statusFilter = '';
  dateFilter = '';
  orderCodeFilter = '';

  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private loadingService:LoadingService
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
    this.loadingService.show();
   this.orderService.getOrdersById(
  this.userId,
  this.statusFilter,
  this.dateFilter,
  this.orderCodeFilter
)
.subscribe({
  next: (res) => {
    this.orders.set(res.data.map(order => ({
        ...order,
        previousStatus: order.status
      })));
      this.loadingService.hide();
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
    this.loadingService.show();
    this.orderService.getOrders(
  this.statusFilter,
  this.dateFilter,
  this.orderCodeFilter
)
.subscribe({
  next: (res) => {
    this.orders.set(res.data.map(order => ({
      ...order,
      previousStatus: order.status
    })));
    this.loadingService.hide();
  },

  error: (err) => {
    this.loadingService.hide();
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

  printReceipt(orderId: number): void {

  this.orderService.printReceipt(orderId).subscribe({

    next: (blob: Blob) => {

      const url = window.URL.createObjectURL(blob);

      window.open(url);

    },

    error: (err) => {

       Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'Could not print'
        });
    }

  });

}

 printInvoice(orderId: number): void {

  this.orderService.printInvoice(orderId).subscribe({

    next: (blob: Blob) => {

      const url = window.URL.createObjectURL(blob);

      window.open(url);

    },

    error: (err) => {

       Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'Could not print'
        });
    }

  });

}

onStatusChange(event: Event, order: any) {

  const select = event.target as HTMLSelectElement;
  const newStatus = select.value;

  // If cancelling order → show confirmation dialog
  if (newStatus === 'CANCELLED') {

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