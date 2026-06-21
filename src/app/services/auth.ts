import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  currentUserId = signal<number | null>(null);
  currentUser = signal<string | null>(null);
  currentRole = signal<string | null>(null);

  // 🔥 IMPORTANT
  token = signal<string | null>(localStorage.getItem('token'));
  constructor() {
  this.loadUser();
}

  login(id: number, email: string, role: string, token: string) {

  this.currentUserId.set(id);
  this.currentUser.set(email);
  this.currentRole.set(role);

  this.token.set(token);

  localStorage.setItem('userId', id.toString());
  localStorage.setItem('email', email);
  localStorage.setItem('role', role);   
  localStorage.setItem('token', token);
}

  logout() {

    this.currentUserId.set(null);
    this.currentUser.set(null);
    this.currentRole.set(null);

    this.token.set(null);

    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }


  // =====================
  // LOAD USER ON APP START
  // =====================
  private loadUser(): void {

    const id = localStorage.getItem('userId');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (id && user && role && token) {

      this.currentUserId.set(Number(id));
      this.currentUser.set(user);
      this.currentRole.set(role);
    }
  }

  // =====================
  // GETTERS
  // =====================
  getUser(): string | null {
    return this.currentUser();
  }

  getRole(): string | null {
    return this.currentRole();
  }

  getUserId(): number | null {
    return this.currentUserId();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.currentRole()?.toLowerCase() === 'admin';
  }

  isUser(): boolean {
    return this.currentRole()?.toLowerCase() === 'user';
  }
}