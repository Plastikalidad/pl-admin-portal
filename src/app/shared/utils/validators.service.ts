import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  numberFormatValidator(): ValidatorFn {
    return Validators.pattern('^(?:\\d*\.\\d{1,2}|\\d+)$')
  }
}
