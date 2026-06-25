import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent)
  },{
    path: 'verify-email',
    loadComponent: () =>
      import('./pages/verify-email/verify-email').then(m => m.VerifyEmailComponent)
  },{
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent)
  },{
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/products').then(m => m.ProductsComponent)
  },
  {
    path: 'admin-products',
    loadComponent: () =>
      import('./components/admin-products/admin-products').then(m => m.AdminProductsComponent),
    canActivate: [adminGuard]
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
    .then(m => m.AdminCategoriesComponent),
  canActivate: [adminGuard]
},
  {
    path: '**',
    redirectTo: ''
  }];
