import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  isRegisterMode: boolean = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

   toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  login() {
    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    this.http.post<any>(`${environment.apiUrl}/api/auth/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log('Login success:', res);
        console.log('Role:', res.user.role);
        // Save session
        this.auth.login(res.user.id,res.user.email, res.user.role,res.token);

        // Load cart for user
        this.cartService.loadCart(res.user.id);

        // Navigate by role
        if (res.user.role === 'Admin') {
          this.router.navigate(['/admin-products']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Login failed');
      }
    });
  }

  register() {
    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    this.http.post<any>(`${environment.apiUrl}/api/auth/register`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        alert(res.message || 'Registered successfully');
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Registration failed');
      }
    });
  }
}