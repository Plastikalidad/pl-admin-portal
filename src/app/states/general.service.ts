import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public pageTitle = signal<string>('');
  public toast = signal<{ message: string, show: boolean, type: 'alert-info' | 'alert-success' | 'alert-error' }>({ show: false, message: '', type: 'alert-info' })
  constructor() { }
}
