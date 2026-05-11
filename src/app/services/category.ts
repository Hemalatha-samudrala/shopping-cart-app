import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // ✅ GET ALL CATEGORIES
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ✅ ADD CATEGORY
  add(name: string): Observable<any> {
    return this.http.post(this.apiUrl, { name });
  }

  // ✅ UPDATE CATEGORY
  update(id: number, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { name });
  }

  // ✅ DELETE CATEGORY
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}