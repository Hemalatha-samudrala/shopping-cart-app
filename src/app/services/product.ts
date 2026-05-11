import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductService {

  constructor(private http: HttpClient) {}

  addProduct(product: any) {
    return this.http.post(`${environment.apiUrl}/products`, product);
  }


getProducts(categoryId: number | null, search: string) {
  let url = `${environment.apiUrl}/products?search=${search}`;

  if (categoryId !== null) {
    url += `&categoryId=${categoryId}`;
  }

  return this.http.get<any[]>(url);
}

   getCategories() {
    return this.http.get<any[]>(`${environment.apiUrl}/categories`);
  }

  updateProduct(id: number, data: FormData) {
  return this.http.put(`${environment.apiUrl}/products/${id}`, data);
}

deleteProduct(id: number) {
  return this.http.delete(`${environment.apiUrl}/products/${id}`);
}
}