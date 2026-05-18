import { Injectable,signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { ApiResponse } from '../models/api-response';
import { Product } from '../models/product';
import { Category } from '../models/category';

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
  getProducts(categoryId: number | null, search: string) {
    
    let url =
      `${environment.apiUrl}/api/products?search=${search}`;

    if (categoryId !== null) {
      url += `&categoryId=${categoryId}`;
    }

    return this.http.get<ApiResponse<Product[]>>(url);
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