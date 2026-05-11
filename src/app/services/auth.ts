import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ---------- STATE ----------
  currentUserId = signal<number | null>(null);
  currentUser = signal<string | null>(null);
  currentRole = signal<string | null>(null);

  // ---------- LOGIN ----------
  login(id: number,email: string, role: string) {
    this.currentUserId.set(id);
    this.currentUser.set(email);
    this.currentRole.set(role);

    localStorage.setItem('userId', id.toString());
    localStorage.setItem('user', email);
    localStorage.setItem('role', role);
  }

  // ---------- LOGOUT ----------
  logout() {
  this.currentUser.set(null);
  this.currentRole.set(null);

  localStorage.removeItem('user');
  localStorage.removeItem('role');

  }

  // ---------- LOAD USER ON APP START ----------
  loadUser(): string | null {
     const id = localStorage.getItem('userId');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (id && user) {
      this.currentUserId.set(+id);
      this.currentUser.set(user);
      this.currentRole.set(role);
      return user;
    }

    return null;
  }

  // ---------- GETTERS ----------
  getUser(): string | null {
    return this.currentUser();
  }

  getRole(): string | null {
    return this.currentRole();
  }
  getUserId(): number | null {
  return this.currentUserId();
} 

  // ---------- STATUS CHECKS ----------
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentRole() === 'Admin';
  }

  isUser(): boolean {
    return this.currentRole() === 'User';
  }
}