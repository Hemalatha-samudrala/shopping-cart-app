import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');

    if (role === 'Admin') {
      return true;
    }

    alert('Access denied');
    this.router.navigate(['/products']);
    return false;
  }
}
