import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private requestCount = 0;

  loading = signal(false);

  show() {

    this.requestCount++;

    this.loading.set(true);
  }

  hide() {

    this.requestCount--;

    if (this.requestCount <= 0) {

      this.loading.set(false);

      this.requestCount = 0;
    }
  }
}