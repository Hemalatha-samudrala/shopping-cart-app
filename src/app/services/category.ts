import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { ApiResponse } from '../models/api-response';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl =
    `${environment.apiUrl}/api/categories`;

  constructor(private http: HttpClient) {}

  // =====================
  // GET ALL CATEGORIES
  // =====================
  getAll(): Observable<ApiResponse<Category[]>> {

    return this.http.get<ApiResponse<Category[]>>(
      this.apiUrl
    );
  }

  // =====================
  // ADD CATEGORY
  // =====================
  add(categoryName: string):
    Observable<ApiResponse<null>> {

    return this.http.post<ApiResponse<null>>(
      this.apiUrl,
      { categoryName }
    );
  }

  // =====================
  // UPDATE CATEGORY
  // =====================
  update(id: number, categoryName: string):
    Observable<ApiResponse<null>> {

    return this.http.put<ApiResponse<null>>(
      `${this.apiUrl}/${id}`,
      { categoryName }
    );
  }

  // =====================
  // DELETE CATEGORY
  // =====================
  delete(id: number):
    Observable<ApiResponse<null>> {

    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${id}`
    );
  }
}