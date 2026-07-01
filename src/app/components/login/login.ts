import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

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

    Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'Please enter email and password'
    });

    return;
  }

  this.http.post<any>(`${environment.apiUrl}/api/auth/login`, {
    email: this.email,
    password: this.password
  }).subscribe({
    next: (res) => {
      // ✅ FIX: correct path
      const user = res.message.user;
      const token = res.message.token;
       console.log(res);
      // Save session
      this.auth.login(
        user.id,
        user.email,
        user.role,
        token
      );
      // Load cart
      this.cartService.loadCart().subscribe();
      // Navigate by role
      if (user.role === 'Admin') {
        this.router.navigate(['/admin-products']);
      } else {
        this.router.navigate(['/products']);
      }
    },

    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Please enter correct email and password'
      });
    }
  });
}

  register() {
    if (!this.email || !this.password) {
       Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'Please enter email and password'
    });
      return;
    }

    this.http.post<any>(`${environment.apiUrl}/api/auth/register`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registered!',
          text: 'Registered successfully',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
         Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'Registration failed'
        });
      }
    });
  }
  forgot() {
        this.router.navigate(['/forgot-password']);
        Swal.fire({
          icon: 'success',
          title: 'reset link!',
          text: 'sent link successfully',
          timer: 1500,
          showConfirmButton: false
        });
  
  }
}