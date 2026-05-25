import { CartItem } from './cart-item';

export interface Order {
  id: number;
  userId: number;

  totalPrice: number;
  email?:string;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  orderCode:string;
  createdAt?: string;
  previousStatus?: string;
  items?: CartItem[];
}