import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private requestCount = 0;
  loading = signal(false);

  show() {
    this.requestCount++;
    this.loading.set(true);
  }

  hide() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }

    if (this.requestCount === 0) {
      this.loading.set(false);
    }
  }

  reset() {
    this.requestCount = 0;
    this.loading.set(false);
  }
}