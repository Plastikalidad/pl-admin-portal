import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public router = inject(Router);
  public pageTitle = signal<string>('');
  public pageTable = signal<{ table: string, page: number, item: number }[]>([]);
  public toast = signal<{ message: string, show: boolean, type: 'alert-info' | 'alert-success' | 'alert-error' }>({ show: false, message: '', type: 'alert-info' })
}
