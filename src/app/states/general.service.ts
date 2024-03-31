import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public router = inject(Router);
  public pageTitle = signal<string>('');
  public toast = signal<{ message: string, show: boolean, type: 'alert-info' | 'alert-success' | 'alert-error' }>({ show: false, message: '', type: 'alert-info' })


  constructor() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (e.url === '/') {
          this.pageTitle.set('Dashboard');
        }
        if (e.url.includes('/manage-inventory')) {
          this.pageTitle.set('Manage Inventory');
        }
        if (e.url.includes('/restock-history')) {
          this.pageTitle.set('Restock History');
        }
        if (e.url.includes('/available-stocks')) {
          this.pageTitle.set('Available Stocks');
        }
        if (e.url.includes('/settings')) {
          this.pageTitle.set('Settings');
        }
      }
    });
  }

}
