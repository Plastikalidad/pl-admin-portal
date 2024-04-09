import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { DiscountService } from '../../../firebase/services/discount.service';
import { ProductService } from '../../../firebase/services/product.service';
import { RestockService } from '../../../firebase/services/restock.service';
import { SizeService } from '../../../firebase/services/size.service';
import { Discount } from '../../../shared/interfaces/discount.interface';
import { KeyGeneratorService } from '../../../shared/utils/key-generator.service';
import { ValidatorsService } from '../../../shared/utils/validators.service';
import { GeneralService } from '../../../states/general.service';
import { CommonModule } from '@angular/common';
import { StockAdjustmentService } from '../../../firebase/services/stock-adjustment.service';

@Component({
  selector: 'app-stock-adjustment-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stock-adjustment-detail.component.html',
  styleUrl: './stock-adjustment-detail.component.scss'
})
export class StockAdjustmentDetailComponent {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public router = inject(Router);
  public generalService = inject(GeneralService);
  public discountService = inject(DiscountService);
  public stockService = inject(StockAdjustmentService);
  public validatorsService = inject(ValidatorsService);
  public generatorService = inject(KeyGeneratorService);
  public productService = inject(ProductService);
  public sizeService = inject(SizeService);
  public activatedRoute = inject(ActivatedRoute);
  public code = this.activatedRoute.snapshot.params['code'];
  public date = '';


  public sizes = this.sizeService.getSizes();
  public products = this.productService.getProducts();
  public discounts: Discount[] = []

  public ngOnInit(): void {
    this.stockService.getStockAdjustment(this.code).pipe(take(1)).subscribe(restock => {
      const products: { code: string; design: string; size: string; availableStocks: number; addStock: number; regPricePerBundle: number; qtyPerBundle: number; }[] = [];
      Object.keys(restock[0].products).forEach((key: string) => {
        products.push(restock[0].products[parseInt(key)])
      });
      restock[0].products = products;
      for (let product of products) {
        this.addProduct()
      }
      this.form.patchValue(restock[0]);
    });
  }

  public form: FormGroup = this.fb.group({
    key: [''],
    date: [{ value: '', disabled: true }],
    code: [{ value: '', disabled: true }, [Validators.required]],
    products: this.fb.array([]),
    totalPrice: ['', Validators.required],
    notes: [{ value: '', disabled: true }],
    status: ['Pending']
  });

  public initializeProduct() {
    return this.fb.group({
      key: [''],
      code: [{ value: '', disabled: true }, Validators.required],
      design: [{ value: '', disabled: true }, Validators.required],
      size: [{ value: '', disabled: true }, Validators.required],
      availableStocks: [{ value: '', disabled: true }, Validators.required],
      regPricePerBundle: [{ value: '', disabled: true }, Validators.required],
      qtyPerBundle: [{ value: '', disabled: true }, Validators.required],
      addStock: [{ value: '', disabled: true }, Validators.required],
    })
  }

  public getProducts() {
    return (this.form.get('products') as FormArray);
  }


  public addProduct() {
    (this.form.get('products') as FormArray).push(this.initializeProduct());
  }


  public onChangeCode(index: number) {
    const value = (this.form.get('products') as FormArray).get(index.toString())?.get('code')?.value;
    if (value) {
      this.productService.getProduct(value).subscribe(product => {
        (this.form.get('products') as FormArray).get(index.toString())?.patchValue(product[0]);
      })
    }
    else {
      (this.form.get('products') as FormArray).get(index.toString())?.reset();
    }
  }


  public onCancel() {
    this.router.navigate(['stock-adjustments-history']);
  }
}
