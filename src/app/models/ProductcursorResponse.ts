import { Product } from "./product";
export interface ProductCursorResponse {
  products: Product[];
  nextCursor: number | null;
  hasMore: boolean;
}