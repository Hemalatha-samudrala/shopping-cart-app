import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/products').then(m => m.ProductsComponent)
  },
  {
    path: 'admin-products',
    loadComponent: () =>
      import('./components/admin-products/admin-products').then(m => m.AdminProductsComponent)
    },
  {
  path: 'cart',
  loadComponent: () =>
    import('./components/cart/cart').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/checkout/checkout').then(m => m.CheckoutComponent),
    },
    {
  path: 'orders',
  loadComponent: () =>
    import('./components/orders/orders').then(m => m.OrdersComponent)
  },
  {
  path: 'admin-categories',
  loadComponent: () => import('./components/admin-categories/admin-categories')
    .then(m => m.AdminCategoriesComponent)
},
  {
    path: '**',
    redirectTo: ''
  }];
