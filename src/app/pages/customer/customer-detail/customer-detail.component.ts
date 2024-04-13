import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CapColorService } from '../../../firebase/services/cap-color.service';
import { ProductService } from '../../../firebase/services/product.service';
import { SizeService } from '../../../firebase/services/size.service';
import { Product } from '../../../shared/interfaces/product.interface';
import { ValidatorsService } from '../../../shared/utils/validators.service';
import { GeneralService } from '../../../states/general.service';
import { CustomerService } from '../../../firebase/services/customer.service';
import { Customer } from '../../../shared/interfaces/customer.interface';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent {
  public activatedRoute = inject(ActivatedRoute);
  public fb = inject(FormBuilder);
  public customerService = inject(CustomerService);
  public generalService = inject(GeneralService);
  public sizeService = inject(SizeService);
  public validatorsService = inject(ValidatorsService);
  public location = inject(Location);

  public router = inject(Router);
  public name = this.activatedRoute.snapshot.params['code'];
  public customer = this.customerService.getCustomer(this.name);

  public sizes = this.sizeService.getSizes();

  public form: FormGroup = this.fb.group({
    key: [''],
    code: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    contactNumber: ['', [Validators.required]],
    address: ['', [Validators.required]],
    modeOfDelivery: ['', [Validators.required]],
    modeOfPayment: ['', [Validators.required]],
    orderedFrom: ['', [Validators.required]],
  });

  public ngOnInit(): void {
    this.customerService.getCustomer(this.name).subscribe((customer: Customer[]) => {
      this.form.patchValue(customer[0]);
    });
  }


  public async onSubmit() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }
    try {
      await this.customerService.updateCustomer(this.form.getRawValue());
      this.location.back();
      this.generalService.toast.set({ show: true, message: 'Customer successfully updated', type: 'alert-success' });
    } catch (e) {
    }

  }

  public onCancel() {
    this.router.navigate(['customer-directory']);
  }

}
