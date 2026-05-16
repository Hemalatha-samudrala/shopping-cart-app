import { CartItem } from './cart-item';

export interface Order {
  id: number;
  userId: number;

  totalPrice: number;
  email?:string;
  status: 'Placed' | 'Processing' | 'Delivered' | 'Cancelled';
  orderCode:string;
  createdAt?: string;

  items?: CartItem[];
}