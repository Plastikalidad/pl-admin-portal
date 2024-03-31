import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyGeneratorService {

  constructor() { }

  generateKey(prefix: string) {
    return `${prefix}-` + Math.random().toString(16).slice(2)
  }
}
