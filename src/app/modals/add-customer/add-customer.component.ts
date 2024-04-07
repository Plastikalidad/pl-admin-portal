import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '../../shared/utils/validators.service';
import { GeneralService } from '../../states/general.service';
import { CustomerService } from '../../firebase/services/customer.service';
import { CommonModule } from '@angular/common';
import { KeyGeneratorService } from '../../shared/utils/key-generator.service';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public generalService = inject(GeneralService);
  public customerService = inject(CustomerService);
  public validatorsService = inject(ValidatorsService);
  public generatorService = inject(KeyGeneratorService);
  public customers = this.customerService.getCustomers();

  public form: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    contactNumber: ['', [Validators.required]],
    address: ['', [Validators.required]],
    modeOfDelivery: ['', [Validators.required]],
    modeOfPayment: ['', [Validators.required]],
    orderedFrom: ['', [Validators.required]],
  });



  public openModal() {
    this.dialogModal?.nativeElement.showModal();
    this.form.get('code')?.disable();
    this.form.get('code')?.setValue(this.generatorService.generateKey('C'));
  }

  public async onSubmit() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }
    try {
      await this.customerService.addCustomer(this.form.getRawValue());
      this.form.reset();
      this.generalService.toast.set({ show: true, message: 'Customer successfully added', type: 'alert-success' });
      (this.dialogModal?.nativeElement as HTMLDialogElement).close()
    } catch (e) {
      (this.dialogModal?.nativeElement as HTMLDialogElement).close()
    }

  }

  public onCancel() {
    this.form.reset();
    (this.dialogModal?.nativeElement as HTMLDialogElement).close()
  }
}
