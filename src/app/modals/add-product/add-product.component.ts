import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralService } from '../../states/general.service';
import { ProductService } from '../../firebase/services/product.service';
import { ValidatorsService } from '../../shared/utils/validators.service';
import { CapColorService } from '../../firebase/services/cap-color.service';
import { SizeService } from '../../firebase/services/size.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public generalService = inject(GeneralService);
  public productService = inject(ProductService);
  public capColorService = inject(CapColorService);
  public sizeService = inject(SizeService);
  public validatorsService = inject(ValidatorsService);

  public capColors = this.capColorService.getCapColors();
  public sizes = this.sizeService.getSizes();

  public form: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    design: ['', [Validators.required]],
    size: ['', [Validators.required]],
    capColors: ['', [Validators.required]],
    regPricePerBundle: ['', [Validators.required, this.validatorsService.numberFormatValidator()]],
    qtyPerBundle: ['', [Validators.required]],
    sellingPricePerPiece: ['', [Validators.required, this.validatorsService.numberFormatValidator()]],
    sellingPricePer50: ['', [Validators.required, this.validatorsService.numberFormatValidator()],],
    sellingPricePer100: ['', [Validators.required, this.validatorsService.numberFormatValidator()]],
    sellingPricePer500: ['', [Validators.required, this.validatorsService.numberFormatValidator()]],
    availableStocks: ['', [Validators.min(0), this.validatorsService.numberFormatValidator()]],
  });



  public openModal() {
    this.dialogModal?.nativeElement.showModal()
  }

  public async onSubmit() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }
    try {
      await this.productService.addProduct(this.form.getRawValue());
      this.form.reset();
      this.generalService.toast.set({ show: true, message: 'Product successfully added', type: 'alert-success' });
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
