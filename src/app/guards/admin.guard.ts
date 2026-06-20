import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  const role = localStorage.getItem('role');
  console.log('Admin Guard Role:', role);
  if (role === 'Admin') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};