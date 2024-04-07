import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../firebase/services/product.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/utils/validators.service';
import { GeneralService } from '../../../states/general.service';
import { Product } from '../../../shared/interfaces/product.interface';
import { CapColorService } from '../../../firebase/services/cap-color.service';
import { SizeService } from '../../../firebase/services/size.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-detail',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './products-detail.component.html',
  styleUrl: './products-detail.component.scss'
})
export class ProductsDetailComponent implements OnInit {
  public activatedRoute = inject(ActivatedRoute);
  public fb = inject(FormBuilder);
  public productService = inject(ProductService);
  public generalService = inject(GeneralService);
  public capColorService = inject(CapColorService);
  public sizeService = inject(SizeService);
  public validatorsService = inject(ValidatorsService);

  public router = inject(Router);
  public name = this.activatedRoute.snapshot.params['code'];
  public product = this.productService.getProduct(this.name);

  public capColors = this.capColorService.getCapColors();
  public sizes = this.sizeService.getSizes();

  public form: FormGroup = this.fb.group({
    key: [''],
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

  public ngOnInit(): void {
    this.productService.getProduct(this.name).subscribe((product: Product[]) => {
      this.form.patchValue(product[0]);
    });
  }


  public async onSubmit() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }
    try {
      await this.productService.updateProduct(this.form.getRawValue());
      this.generalService.toast.set({ show: true, message: 'Product successfully updated', type: 'alert-success' });
    } catch (e) {
    }

  }

  public onCancel() {
    this.router.navigate(['manage-inventory']);
  }

}
