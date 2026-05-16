import { Product } from './product';

export interface CartItem {

  id: number;
  productId: number;
  quantity: number;
  price: number;
   productName: string;
  imageUrl: string;
  product?: Product;
  totalPrice?: number;
}