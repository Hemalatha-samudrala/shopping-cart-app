import { Injectable,signal } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { ApiResponse } from '../models/api-response';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { ProductCursorResponse } from '../models/ProductcursorResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private http: HttpClient) {}

  // =====================
  // ADD PRODUCT
  // =====================
  addProduct(product: FormData) {
    return this.http.post<ApiResponse<null>>(
      `${environment.apiUrl}/api/products`,
      product
    );
  }

  // =====================
  // GET PRODUCTS (with filters)
  // =====================
getProducts(
  categoryId: number | null,
  search: string,
  limit: number = 8,
  cursor?: number | null
) {
  let params = new HttpParams()
    .set('search', search)
    .set('limit', limit);

  if (categoryId !== null) {
    params = params.set('categoryId', categoryId);
  }

  if (cursor !== null && cursor !== undefined) {
    params = params.set('cursor', cursor);
  }

  return this.http.get<ApiResponse<ProductCursorResponse>>(
    `${environment.apiUrl}/api/products`,
    { params }
  );
}

  // =====================
  // GET CATEGORIES
  // =====================
  getCategories() {
    return this.http.get<ApiResponse<Category[]>>(
      `${environment.apiUrl}/api/categories`
    );
  }

  // =====================
  // UPDATE PRODUCT
  // =====================
  updateProduct(id: number, data: FormData) {
    return this.http.put<ApiResponse<null>>(
      `${environment.apiUrl}/api/products/${id}`,
      data
    );
  }

  // =====================
  // DELETE PRODUCT
  // =====================
  deleteProduct(id: number) {
    return this.http.delete<ApiResponse<null>>(
      `${environment.apiUrl}/api/products/${id}`
    );
  }
}