import { Injectable, signal } from '@angular/core';
import { User } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = signal<User>({});
  constructor() { }
}
