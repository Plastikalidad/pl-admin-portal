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
        if (e.url.includes('/reserved-orders')) {
          this.pageTitle.set('Reserved Orders');
        }
        if (e.url.includes('/completed-orders')) {
          this.pageTitle.set('Completed Orders');
        }
        if (e.url.includes('/order-queue')) {
          this.pageTitle.set('Order Queue');
        }
        if (e.url.includes('/cancelled-orders')) {
          this.pageTitle.set('Cancelled Orders');
        }
        if (e.url.includes('/customer-directory')) {
          this.pageTitle.set('Customer Directory');
        }
        if (e.url.includes('/settings')) {
          this.pageTitle.set('Settings');
        }
      }
    });
  }

}
