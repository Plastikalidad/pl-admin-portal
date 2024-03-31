import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralService } from '../../states/general.service';
import { ValidatorsService } from '../../shared/utils/validators.service';
import { DiscountService } from '../../firebase/services/discount.service';
import { KeyGeneratorService } from '../../shared/utils/key-generator.service';
import { Discount } from '../../shared/interfaces/discount.interface';

@Component({
  selector: 'app-add-discount',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-discount.component.html',
  styleUrl: './add-discount.component.scss'
})
export class AddDiscountComponent {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public generalService = inject(GeneralService);
  public discountService = inject(DiscountService);
  public validatorsService = inject(ValidatorsService);
  public generatorService = inject(KeyGeneratorService);
  public toUpdate = false;

  public form: FormGroup = this.fb.group({
    key: [''],
    code: ['', [Validators.required]],
    fromPrice: ['', [Validators.required]],
    toPrice: ['', [Validators.required]],
    discountOne: ['', [Validators.required]],
    discountTwo: ['', [Validators.required]],
    discountThree: ['', [Validators.required]],
    discountFour: ['', [Validators.required]],
  });



  public openModal(update: boolean = false, data: Discount | null = null) {
    if (update && data) {
      this.toUpdate = true;
      this.form.patchValue(data)
    }
    else {
      this.toUpdate = false;
      this.form.get('code')?.setValue(this.generatorService.generateKey('D'));
    }
    this.form.get('code')?.disable();
    this.dialogModal?.nativeElement.showModal()
  }

  public async onSubmit() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }
    try {
      if (this.toUpdate) {
        await this.discountService.updateDiscount(this.form.getRawValue());
        this.generalService.toast.set({ show: true, message: 'Discount successfully updated', type: 'alert-success' });
      }
      else {

        await this.discountService.addDiscount(this.form.getRawValue());
        this.generalService.toast.set({ show: true, message: 'Discount successfully added', type: 'alert-success' });
      }
      this.form.reset();
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
